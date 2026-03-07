const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const REPORT_NORMAL_RANGES = {
  'CBC (Complete Blood Count)': 'WBC: 4.5–11.0 ×10⁹/L, RBC: 4.5–5.9 ×10¹²/L (M), 4.0–5.2 (F), Hemoglobin: 13.5–17.5 g/dL (M), 12.0–15.5 (F), Hematocrit: 41–53% (M), 36–46% (F), Platelets: 150–400 ×10⁹/L',
  'LFT (Liver Function Test)': 'ALT: 7–56 U/L, AST: 10–40 U/L, ALP: 44–147 U/L, Bilirubin Total: 0.2–1.2 mg/dL, Albumin: 3.5–5.0 g/dL, Total Protein: 6.3–8.2 g/dL',
  'KFT (Kidney Function Test)': 'Creatinine: 0.6–1.2 mg/dL (M), 0.5–1.1 (F), BUN: 7–20 mg/dL, eGFR: >60 mL/min/1.73m², Uric Acid: 3.4–7.0 mg/dL (M), 2.4–6.0 (F)',
  'Lipid Profile': 'Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >60 mg/dL (optimal), Triglycerides: <150 mg/dL, VLDL: 2–30 mg/dL',
  'Thyroid (TFT)': 'TSH: 0.4–4.0 mIU/L, T3: 80–200 ng/dL, T4 (Free): 0.8–1.8 ng/dL',
  'Blood Sugar / HbA1c': 'Fasting Glucose: 70–100 mg/dL, Post-prandial: <140 mg/dL, HbA1c: <5.7% (Normal), 5.7–6.4% (Pre-diabetic), ≥6.5% (Diabetic)',
  'Blood Pressure Report': 'Systolic: <120 mmHg (Normal), 120-129 (Elevated), 130-139 (High Stage 1), ≥140 (High Stage 2); Diastolic: <80 mmHg (Normal), 80-89 (High Stage 1), ≥90 (High Stage 2)',
  'Diabetes Screening': 'Fasting Glucose: 70–100 mg/dL, Post-prandial (2hr): <140 mg/dL, HbA1c: <5.7% (Normal), 5.7–6.4% (Pre-diabetic), ≥6.5% (Diabetic), Fasting Insulin: 2.6–24.9 µIU/mL',
  'Urine Routine (Urinalysis)': 'pH: 4.5–8.0, Specific Gravity: 1.005–1.030, Protein: Negative, Glucose: Negative, WBC: 0–5/HPF, RBC: 0–2/HPF, Nitrites: Negative',
  'Urine Culture': 'No growth (sterile) — <1000 CFU/mL is usually not significant; ≥100,000 CFU/mL indicates infection',
  'Stool Routine': 'Color: Brown, Consistency: Formed, Occult Blood: Negative, Parasites: None, Mucus: None, RBC/WBC: Nil',
  'ECG / EEG Report': 'Normal sinus rhythm: 60–100 bpm, PR interval: 0.12–0.20 s, QRS: <0.12 s, QTc: <0.44 s (M), <0.46 s (F)',
  'Chest X-Ray': 'Clear lung fields, normal cardiac silhouette (<50% CTR), no pleural effusion, no infiltrates.',
  'Iron Studies': 'Serum Iron: 60–170 µg/dL, TIBC: 240–450 µg/dL, Ferritin: 12–300 ng/mL (M), 12–150 (F), Transferrin Saturation: 20–50%',
  'Vitamin D & B12': 'Vitamin D (25-OH): 30–100 ng/mL (Sufficient), 20–29 (Insufficient), <20 (Deficient); Vitamin B12: 200–900 pg/mL',
  'Coagulation Profile (PT/INR)': 'PT: 11–13.5 seconds, INR: 0.8–1.1 (therapeutic for anticoagulation: 2.0–3.0), aPTT: 25–35 seconds',
  'Hormone Panel (Testosterone/Estrogen/FSH/LH)': 'Testosterone (M): 300–1000 ng/dL; Estradiol (F): varies by cycle; FSH (F, follicular): 3.5–12.5 mIU/mL; LH (F, follicular): 2.4–12.6 mIU/mL',
};

// POST /api/reports/analyze
exports.analyzeReport = async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No report file uploaded.' });
    }
    const { reportType } = req.body;
    if (!reportType) {
      return res.status(400).json({ message: 'reportType is required.' });
    }

    filePath = req.file.path;
    const fileData = fs.readFileSync(filePath);
    const base64Data = fileData.toString('base64');
    const mimeType = req.file.mimetype;

    const normalRanges = REPORT_NORMAL_RANGES[reportType] || 'Standard medical reference ranges apply.';

    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a medical AI assistant analyzing a patient's ${reportType} report.

Normal reference ranges for ${reportType}:
${normalRanges}

Analyze this medical report and respond ONLY with valid JSON (no markdown, no code fences, no extra text). Use this exact structure:

{
  "parameters": [
    {
      "name": "Parameter Name",
      "value": 12.5,
      "unit": "g/dL",
      "normalMin": 12.0,
      "normalMax": 17.5,
      "status": "normal"
    }
  ],
  "summary": "Brief 2-3 sentence overall health summary based on results.",
  "urgency": "none",
  "urgencyNote": "",
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ],
  "overallStatus": "normal"
}

Rules:
- "parameters": array of every test parameter found. "value" must be a number. "status" must be exactly one of: "normal", "high", "low", "critical". Use "critical" only if the value is dangerously out of range.
- "normalMin" and "normalMax": the numeric reference range boundaries. If only an upper limit exists (e.g. <200), set normalMin to 0. If only a lower limit (e.g. >60), set normalMax to the value * 3 as a reasonable upper bound.
- "summary": a patient-friendly plain-text summary.
- "urgency": one of "none", "low", "moderate", "high". "high" means seek immediate medical attention.
- "urgencyNote": explanation if urgency is not "none", otherwise empty string.
- "suggestions": array of actionable health suggestions (diet, lifestyle, follow-up tests).
- "overallStatus": one of "normal", "borderline", "abnormal", "critical" — the overall report verdict.

Respond with ONLY the JSON object. No extra text before or after.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ]);

    const rawText = await result.response.text();

    // Try to parse as JSON, strip markdown fences if present
    let parsed;
    try {
      const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: return raw text if parsing fails
      return res.json({
        reportType,
        normalRanges,
        analysis: rawText,
        structured: null,
      });
    }

    res.json({
      reportType,
      normalRanges,
      structured: parsed,
    });
  } catch (err) {
    console.error('Report analysis error:', err);
    const isQuota = err.message && err.message.includes('quota');
    if (isQuota) {
      return res.status(429).json({ message: 'AI quota exceeded. Please try again later.' });
    }
    res.status(500).json({ message: 'Failed to analyze report', error: err.message });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch (_) {}
    }
  }
};

// GET /api/reports/types
exports.getReportTypes = (req, res) => {
  res.json({ reportTypes: Object.keys(REPORT_NORMAL_RANGES) });
};

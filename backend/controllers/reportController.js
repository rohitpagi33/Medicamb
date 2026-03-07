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
  'Urine Routine (Urinalysis)': 'pH: 4.5–8.0, Specific Gravity: 1.005–1.030, Protein: Negative, Glucose: Negative, WBC: 0–5/HPF, RBC: 0–2/HPF, Nitrites: Negative',
  'Urine Culture': 'No growth (sterile) — <1000 CFU/mL is usually not significant; ≥100,000 CFU/mL indicates infection',
  'Stool Routine': 'Color: Brown, Consistency: Formed, Occult Blood: Negative, Parasites: None, Mucus: None, RBC/WBC: Nil',
  'ECG / EEG Report': 'Normal sinus rhythm: 60–100 bpm, PR interval: 0.12–0.20 s, QRS: <0.12 s, QTc: <0.44 s (M), <0.46 s (F)',
  'MRI / CT Scan (Brain)': 'No acute infarct, hemorrhage, or mass lesion. Normal ventricular size. No midline shift.',
  'MRI Spine': 'No disc herniation or nerve compression. Normal vertebral alignment. No signal changes.',
  'Chest X-Ray': 'Clear lung fields, normal cardiac silhouette (<50% CTR), no pleural effusion, no infiltrates.',
  'Bone Density (DEXA)': 'T-score: ≥-1.0 (Normal), -1.0 to -2.5 (Osteopenia), ≤-2.5 (Osteoporosis)',
  'Iron Studies': 'Serum Iron: 60–170 µg/dL, TIBC: 240–450 µg/dL, Ferritin: 12–300 ng/mL (M), 12–150 (F), Transferrin Saturation: 20–50%',
  'Vitamin D & B12': 'Vitamin D (25-OH): 30–100 ng/mL (Sufficient), 20–29 (Insufficient), <20 (Deficient); Vitamin B12: 200–900 pg/mL',
  'Coagulation Profile (PT/INR)': 'PT: 11–13.5 seconds, INR: 0.8–1.1 (therapeutic for anticoagulation: 2.0–3.0), aPTT: 25–35 seconds',
  'Semen Analysis': 'Volume: 1.5–5.0 mL, pH: 7.2–8.0, Sperm Count: >15 million/mL, Motility: >40% total (>32% progressive), Morphology: >4% normal',
  'Hormone Panel (Testosterone/Estrogen/FSH/LH)': 'Testosterone (M): 300–1000 ng/dL; Estradiol (F): varies by cycle; FSH (F, follicular): 3.5–12.5 mIU/mL; LH (F, follicular): 2.4–12.6 mIU/mL',
  'COVID / Dengue / Malaria Test': 'Negative result indicates no active infection. Positive result should be correlated with clinical findings.',
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

Please analyze this medical report image/document and provide:

1. **IDENTIFIED VALUES**: List all test parameters found with their values and units.
2. **NORMAL vs ABNORMAL**: For each value, clearly state if it is NORMAL, HIGH, or LOW compared to reference ranges.
3. **MEDICAL SUMMARY**: A clear, easy-to-understand summary of what these results mean.
4. **SUGGESTIONS**: Specific health recommendations based on any abnormal findings. Include dietary advice, lifestyle changes, or follow-up tests if needed.
5. **URGENCY**: State if any values require immediate medical attention.

Be precise, medically accurate, and explain in terms a patient can understand. Do not diagnose but provide informational analysis.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ]);

    const analysis = await result.response.text();

    res.json({
      reportType,
      normalRanges,
      analysis,
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

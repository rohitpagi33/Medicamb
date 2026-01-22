const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');
    const medicineName = text.trim();

    // First, check if the medicine is for fever/cold/flu
    const checkPrompt = `
      Analyze the medicine "${medicineName}" and determine if it is primarily used for treating:
      - Fever
      - Cold
      - Flu (influenza)
      - Common cold symptoms
      
      Respond with ONLY "YES" if the medicine is primarily for fever, cold, or flu.
      Respond with ONLY "NO" if the medicine is for any other condition or disease.
      Do not provide any additional explanation, just "YES" or "NO".
    `;

    const checkModel = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const checkResult = await checkModel.generateContent(checkPrompt);
    const checkAnswer = await checkResult.response.text().trim().toUpperCase();

    // If medicine is not for fever/cold/flu, return restricted message
    if (!checkAnswer.includes("YES")) {
      return res.json({
        medicineName: medicineName || "Unknown Medicine",
        aiDetails: "We could not find this medicine in our database. Currently, our system is only available for medicines related to **fever, cold, and flu**. Other diseases will be available soon. Please check back later for updates.",
        restricted: true
      });
    }

    // If medicine is for fever/cold/flu, proceed with detailed information
    const prompt = `
      Give me detailed information about the medicine "${medicineName}".
      Please include:
      - Manufacturer (who makes it)
      - Ingredients
      - Uses (specifically for fever, cold, or flu)
      - Common side effects
      Format your answer with clear headings and bullet points.
    `;

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const answer = await result.response.text();

    res.json({
      medicineName,
      aiDetails: answer,
      restricted: false
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to process image or get AI response' });
  }
});

module.exports = router;
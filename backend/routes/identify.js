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

    // Compose prompt for Gemini
    const prompt = `
      Give me detailed information about the medicine "${medicineName}".
      Please include:
      - Manufacturer (who makes it)
      - Ingredients
      - Uses
      - Common side effects
      Format your answer with clear headings and bullet points.
    `;

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const answer = await result.response.text();

    res.json({
      medicineName,
      aiDetails: answer
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to process image or get AI response' });
  }
});

module.exports = router;
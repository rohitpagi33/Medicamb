const { GoogleGenerativeAI } = require("@google/generative-ai");
const AIMessage = require("../models/AIMessage");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askAI = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ message: 'Question is required' });

  try {
    // Use the latest available model
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a helpful medical assistant. Provide clear, safe, and informative answers to medical questions. If the question is outside your expertise, advise the user to consult a healthcare professional.\n\n${question}`;
    const result = await model.generateContent(prompt);
    const answer = await result.response.text();
    console.log("Gemini answer:", answer);

    // Persist this Q&A for the logged-in user
    if (req.user && req.user._id) {
      try {
        await AIMessage.create({
          user: req.user._id,
          question,
          answer,
        });
      } catch (saveErr) {
        console.error("Failed to save AI message:", saveErr);
      }
    }

    res.json({ answer });
  } catch (err) {
    const isQuotaError = err.message && err.message.includes("quota");
    if (isQuotaError) {
      res.status(429).json({ message: "AI quota exceeded. Please try again later or check your API usage." });
    } else {
      res.status(500).json({ message: 'AI service error', error: err.message });
    }
  }
}; 

// GET /api/ai/history - return AI Q&A history for current user
exports.getHistory = async (req, res) => {
  try {
    const history = await AIMessage.find({ user: req.user._id })
      .sort({ createdAt: 1 })
      .lean();
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch AI chat history', error: err.message });
  }
};
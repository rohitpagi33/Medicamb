const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askAI = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ message: 'Question is required' });

  try {
    // First, check if the question is about fever/cold/flu
    let isAllowed = true;
    
    try {
      const checkPrompt = `
        Analyze the following medical question and determine if it is related to:
        - Fever
        - Cold (common cold)
        - Flu (influenza)
        - Symptoms of cold/flu (like cough, sneezing, runny nose, body aches, etc.)
        - Treatment for cold/flu
        - Prevention of cold/flu
        
        Question: "${question}"
        
        Respond with ONLY "YES" if the question is about fever, cold, or flu.
        Respond with ONLY "NO" if the question is about any other disease or medical condition.
        Do not provide any additional explanation, just "YES" or "NO".
      `;

      const checkModel = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
      const checkResult = await checkModel.generateContent(checkPrompt);
      const checkAnswer = await checkResult.response.text().trim().toUpperCase();

      // If question is not about fever/cold/flu, set flag
      if (!checkAnswer.includes("YES")) {
        isAllowed = false;
      }
    } catch (checkErr) {
      console.error("Check prompt error:", checkErr);
      // If check fails, allow the question to proceed (fail open)
      // This prevents the check from blocking legitimate questions
      isAllowed = true;
    }

    // If question is not about fever/cold/flu, return restricted message
    if (!isAllowed) {
      return res.json({ 
        answer: "I apologize, but I'm currently only available to answer questions about **fever, cold, and flu**. We are still working on other diseases and they will be available soon. Please feel free to ask me anything about fever, cold, or flu symptoms, treatments, and prevention.",
        restricted: true
      });
    }

    // If question is about fever/cold/flu, proceed with answer
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a helpful medical assistant specialized in fever, cold, and flu. Provide clear, safe, and informative answers to medical questions about fever, cold, and flu. Always remind users that this is for informational purposes and they should consult a healthcare professional for medical advice.\n\nQuestion: ${question}`;
    const result = await model.generateContent(prompt);
    const answer = await result.response.text();
    console.log("Gemini answer:", answer);
    res.json({ answer, restricted: false });
  } catch (err) {
    console.error("AI Controller Error:", err);
    const isQuotaError = err.message && (err.message.includes("quota") || err.message.includes("429"));
    const isApiKeyError = err.message && (err.message.includes("API_KEY") || err.message.includes("api key"));
    
    if (isQuotaError) {
      res.status(429).json({ 
        message: "AI quota exceeded. Please try again later or check your API usage.",
        error: "Quota limit reached"
      });
    } else if (isApiKeyError) {
      res.status(500).json({ 
        message: "AI service configuration error. Please contact support.",
        error: "API key issue"
      });
    } else {
      res.status(500).json({ 
        message: 'AI service error. Please try again later.',
        error: err.message || 'Unknown error'
      });
    }
  }
}; 
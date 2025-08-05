const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash-latest",
});

const SYSTEM_PROMPT = `
You are Gemini, a sustainable energy expert integrated into a smart dashboard.
Your job is to: Analyze home energy usage patterns, recommend strategies to save energy, advise on appliance usage and green practices 
and respond in a friendly and professional tone, suitable for general home users.
Limit the answer to 100 words, make it compact but informative and interesting at the same time.
`;

async function askGemini(userQuery) {
  const result = await model.generateContent(
    `${SYSTEM_PROMPT}\nUser: ${userQuery}`
  );

  const response = await result.response;
  return response.text();
}

module.exports = { askGemini };

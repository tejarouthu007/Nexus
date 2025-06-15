import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate', async (req, res) => {
  let { prompt } = req.body;

  prompt = `Your job is to generate only code with inline comments. Do not include any explanations, titles, markdown, or extra text outside the code. Just output the complete code in plain text with appropriate inline comments. Only output valid code, no explanations, no markdown, no \`\`\`. Just plain code in text format. \n\n${prompt}`;


  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const code = response.text();

    res.json({ code });
  } catch (err) {
    console.error('Gemini Error:', err);
    res.status(500).json({ error: 'Failed to generate code' });
  }
});

export default router;

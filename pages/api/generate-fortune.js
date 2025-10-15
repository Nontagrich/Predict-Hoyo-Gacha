// pages/api/generate-fortune.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // ✅ ใช้ model ที่มีอยู่จริง - เลือกตัวที่เร็วและประหยัด
    const model = genAI.getGenerativeModel({ 
      model: 'models/gemini-2.5-flash' 
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const fortune = JSON.parse(jsonText);

    // Validate the fortune structure
    if (!fortune.luckyDays || !Array.isArray(fortune.luckyDays)) {
      throw new Error('Invalid fortune structure received from AI');
    }

    return res.status(200).json({ fortune });
  } catch (error) {
    console.error('Error generating fortune:', error);
    return res.status(500).json({ 
      error: 'Failed to generate fortune',
      details: error.message 
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

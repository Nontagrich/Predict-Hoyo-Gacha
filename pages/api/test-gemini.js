// pages/api/test-gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'No API key found' });
    }

    // Test with simple fetch to check API key
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'API Key test failed',
        details: data 
      });
    }

    // แสดง models ที่ใช้ได้
    const availableModels = data.models
      ?.filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name);

    return res.status(200).json({ 
      success: true,
      availableModels,
      recommendation: availableModels?.[0] || 'No models available'
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
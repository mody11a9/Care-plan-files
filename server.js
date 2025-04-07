
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { disease } = req.body;

  try {
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful nurse assistant generating detailed care plans in English and Arabic."
          },
          {
            role: "user",
            content: `Write a detailed nursing care plan for the disease: ${disease}. Include Assessment, Nursing Diagnosis, Rational, and Interventions.`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await openaiResponse.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "لا يوجد رد من OpenAI." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "خطأ في الاتصال بـ OpenAI." });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

// Production Express Server for STUDKIT with Server-side OpenAI API Proxy
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// Secure Server-side OpenAI API Proxy endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY || '';
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const { prompt, systemInstruction } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const sysPrompt =
      systemInstruction ||
      `You are the official STUDKIT Student Operating System AI Academic Tutor.
Provide factually accurate, concise, direct answers without meta-commentary.`;

    if (!apiKey) {
      return res.json({
        text: `## ⚠️ OpenAI API Key Not Configured\n\nPlease set OPENAI_API_KEY in server environment variables.`,
        model: 'unconfigured',
      });
    }

    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: sysPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 2500,
      }),
    });

    if (!openAiRes.ok) {
      const errData = await openAiRes.json().catch(() => ({}));
      return res.status(openAiRes.status).json({
        error: errData?.error?.message || `OpenAI API returned status ${openAiRes.status}`,
      });
    }

    const data = await openAiRes.json();
    const text = data?.choices?.[0]?.message?.content || '';

    return res.json({ text, model });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Serve frontend for all remaining routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`STUDKIT Server running on http://localhost:${PORT}`);
});

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MongoClient } from 'mongodb';

// Global MongoDB client
let mongoClient: MongoClient | null = null;
async function getMongoClient() {
  if (!mongoClient) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    console.log('Connected to MongoDB');
  }
  return mongoClient;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Route for Saving Responses
  app.post('/api/responses', async (req, res) => {
    try {
      const responseDoc = req.body;
      const client = await getMongoClient();
      const db = client.db(); // Uses the database name from the connection string or 'test'
      const collection = db.collection('responses');
      
      const result = await collection.insertOne({
        ...responseDoc,
        createdAt: new Date()
      });
      
      res.json({ success: true, id: result.insertedId });
    } catch (error: any) {
      console.error('Error saving to MongoDB:', error);
      res.status(500).json({ error: error.message || 'Failed to save response' });
    }
  });

  // API Route for Gemini analysis
  app.post('/api/analyze', async (req, res) => {
    try {
      const { topTraits, language } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is required');
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      const targetLang = language === 'ja' ? 'Japanese' : (language === 'ko' ? 'Korean' : 'English');

      const prompt = `You are a psychological and cognitive expert.
Based on the user's top three dominant traits from a psychological assessment, provide a concrete, easy-to-understand summary of what kind of person they are, their strengths, and what motivates them. Write in a friendly and professional tone. Output exactly in ${targetLang}.

Top Traits (in English):
${topTraits.map((t: any) => `- ${t.name} (${t.score}%)`).join('\n')}

Analyze these traits and return a strictly valid JSON object with the following structure. Do not include markdown formatting or backticks:
{
  "summary": "Your detailed summary paragraph here in ${targetLang}...",
  "translatedTraits": {
    "Trait 1 English Name": "Trait 1 translated to ${targetLang}",
    "Trait 2 English Name": "Trait 2 translated to ${targetLang}",
    "Trait 3 English Name": "Trait 3 translated to ${targetLang}"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      let resultText = response.text || "{}";
      resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
      let analyzeResult = { summary: "", translatedTraits: {} };
      try {
        analyzeResult = JSON.parse(resultText);
      } catch (e) {
        analyzeResult.summary = resultText;
      }

      res.json({ result: analyzeResult });
    } catch (error: any) {
      console.error('Error in /api/analyze:', error);
      res.status(500).json({ error: error.message || 'Analysis failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Note: express v5 requires *all
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
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
  const PORT = 3000;

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

      const prompt = `You are an expert cognitive architect for the Human Cognitive-Motivational Graph (HCMG). 
Based on these top 3 dominant traits of a user, write a brief, insightful, and slightly mysterious 3-sentence profile describing their cognitive archetype. Keep it professional and focused on their network topology.

Top Traits:
${topTraits.map((t: any) => `- ${t.name} (${t.score}%)`).join('\n')}

Output ONLY the 3-sentence description limit in ${targetLang}. No pleasantries.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      res.json({ result: response.text });
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

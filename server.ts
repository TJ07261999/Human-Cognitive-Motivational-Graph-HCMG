import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MongoClient, ObjectId } from 'mongodb';

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
  const PORT = Number(process.env.PORT) || 3000;

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

  // API Route to fetch a Response by ID
  app.get('/api/responses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const client = await getMongoClient();
      const db = client.db();
      const collection = db.collection('responses');
      
      const doc = await collection.findOne({ _id: new ObjectId(id) });
      if (!doc) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json(doc);
    } catch (error: any) {
      console.error('Error fetching from MongoDB:', error);
      res.status(500).json({ error: 'Failed to fetch response' });
    }
  });

  // API Route for Gemini analysis
  app.post('/api/analyze', async (req, res) => {
    try {
      const { topTraits, bottomTraits, categoryAverages, dependenciesData, showWeakness } = req.body;
      
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
      
      const prompt = `You are a psychological and cognitive expert.
Based on the user's top three dominant traits${showWeakness ? ' and bottom three traits (weaknesses)' : ''} from a psychological assessment, provide a highly detailed, comprehensive, and deep psychological summary of what kind of person they are.

The summary MUST be extremely extensive (at least 600 words) and MUST structurally contain ${showWeakness ? 'FOUR' : 'THREE'} full, deep paragraphs per language:
Paragraph 1: Core Identity & Cognitive Patterns - Analyze how their top traits interact to form their fundamental worldview and thought processes.
Paragraph 2: Execution & Strengths - Detail how they apply these traits to solve complex problems and produce unique value in real-world scenarios.
Paragraph 3: Inner Motivations & Optimal Environment - Explain what drives them internally and the specific conditions they need to thrive.${showWeakness ? '\nParagraph 4: Blind Spots & Areas for Growth - Explore how their BOTTOM traits (weaknesses) manifest in their behavior, highlighting potential pitfalls, cognitive blind spots, and how they can mitigate them. Do this thoughtfully and constructively.' : ''}

Furthermore, provide exactly one informative sentence for each of the 7 abstract cognitive sectors (Energy, Information, Reasoning, Motivation, Execution, Emotional Architecture, Meta-Self) detailing what their profile suggests about their capability in that specific sector.

Based on the top traits and bottom traits, describe the "Cognitive Trade-offs" (i.e. what they sacrifice to achieve their strengths) in one deep paragraph.

Based on the provided Cognitive Dependencies network, describe how their top traits act as an engine to power other capacities in one deep paragraph.

Write in a friendly and professional tone.

Top Traits (in English):
${topTraits.map((t: any) => `- ${t.name} (${t.score}%)`).join('\n')}
${showWeakness ? `\nBottom Traits (Weaknesses, in English):\n${(bottomTraits || []).map((t: any) => `- ${t.name} (${t.score}%)`).join('\n')}` : ''}

Dominant Sectors:
${(categoryAverages || []).map((c: any) => `- ${c.category} (${c.score})`).join('\n')}

Activated Dependencies:
${(dependenciesData || []).map((d: any) => `- ${d.description} (Weight: ${d.weight})`).join('\n')}

Analyze these traits and translate all content into English, Japanese, Korean, Simplified Chinese, and Thai.
Return a STRICTLY VALID JSON object with the following structure. Do not include markdown formatting or backticks.

{
  "summaries": {
    "en": "Your rigorous ${showWeakness ? '4' : '3'}-paragraph summary in English, using \\n\\n for paragraph breaks...",
    "ja": "Your rigorous ${showWeakness ? '4' : '3'}-paragraph summary translated to Japanese...",
    "ko": "...",
    "zh": "...",
    "th": "..."
  },
  "tradeoffs": {
    "en": "Trade-offs analysis in English...",
    "ja": "...",
    "ko": "...",
    "zh": "...",
    "th": "..."
  },
  "dependencies": {
    "en": "Dependencies analysis in English...",
    "ja": "...",
    "ko": "...",
    "zh": "...",
    "th": "..."
  },
  "sectorImplications": {
    "en": { "Energy": "Implication based on top traits...", "Information": "Implication...", "Reasoning": "...", "Motivation": "...", "Execution": "...", "Emotional Architecture": "...", "Meta-Self": "..." },
    "ja": { ... },
    "ko": { ... },
    "zh": { ... },
    "th": { ... }
  },
  "translatedTraits": {
    "en": { "Trait Name": "Translated to English", ... },
    "ja": { "Trait Name": "Translated to Japanese", ... },
    "ko": { "Trait Name": "Translated to Korean", ... },
    "zh": { "Trait Name": "Translated to Simplified Chinese", ... },
    "th": { "Trait Name": "Translated to Thai", ... }
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      let resultText = response.text || "{}";
      resultText = resultText.replace(/```json/gi, '').replace(/```/g, '').trim();
      let analyzeResult = { summaries: {}, translatedTraits: {} };
      try {
        analyzeResult = JSON.parse(resultText);
      } catch (e) {
        console.warn("Failed to parse JSON result from Gemini", e);
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

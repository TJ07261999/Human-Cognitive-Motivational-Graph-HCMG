## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set the `MONGODB_URI` in [.env.local](.env.local) to your Mongo DB URI key
4. Run the app:
   `npm run dev`


If you have Dockerfile, then `docker run -p 3000:3000 --env-file .env hcmg-app`

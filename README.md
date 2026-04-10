# Meemo · K-Beauty Skin Analysis

AI-powered K-beauty routine quiz built for Meemo Wellness. Personalized by skin type, age, climate, sun exposure, and lifestyle habits.

---

## Deploy in 3 steps

### 1. Install & run locally
```bash
npm install
cp .env.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "init meemo skin quiz"
git remote add origin https://github.com/YOUR_ORG/meemo-skin-quiz.git
git push -u origin main
```

### 3. Deploy to Vercel
- Go to vercel.com → New Project → import your repo
- Vercel auto-detects Vite — no config needed
- Go to **Settings → Environment Variables** and add:
  ```
  ANTHROPIC_API_KEY = sk-ant-...
  ```
- Click **Redeploy**

Your site is live at `https://meemo-skin-quiz.vercel.app`

---

## Stack
- React 18 + Vite
- Vercel serverless function (`/api/recommend.js`) as secure API proxy
- Anthropic Claude Sonnet for AI recommendations
- No database — stateless, privacy-first

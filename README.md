# 🥘 AI Pantry Chef

> 🚧 **Work in Progress** — actively being built. Check back soon!

> Upload a photo of your fridge or pantry and get a personalized weekly meal plan based on what you already have.

## 📌 Status
Currently in active development — Phase 1 (project setup) complete. 
Building toward a full-stack AI-powered meal planning app.

## Live Demo
🔗 Coming soon

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, TypeScript, Hono
- **Database:** PostgreSQL, Prisma
- **AI:** Claude API (vision + text)
- **Auth:** Clerk
- **Deployment:** Vercel + Railway

## Features
- 📸 Upload fridge/pantry photos
- 🤖 AI-powered ingredient detection via Claude vision
- ✏️ Review and edit your detected ingredients
- 📅 AI-generated 7-day meal plan
- 💾 Save and revisit your meal plans
- 🔐 Multi-user auth

## Running Locally

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
git clone https://github.com/mollyberg/ai-pantry-chef.git
cd ai-pantry-chef

# Install dependencies
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# Start frontend
npm run frontend

# Start backend (in a separate terminal)
npm run backend
```

Frontend runs at `http://localhost:5173`
Backend runs at `http://localhost:3001`

## Architecture
```
[React Frontend] → REST API → [Hono Backend] → [Claude API]
                                    ↓
                             [PostgreSQL DB]
```

## Author
Molly Berg — [LinkedIn](https://linkedin.com/in/mollykberg) | [GitHub](https://github.com/mollyberg)
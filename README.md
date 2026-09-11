# 🛡️ EduGuard — Student Discipline & Due-Process Agent

EduGuard is an AI-assisted, policy-driven student disciplinary case management platform designed for universities and colleges. It enforces strict procedural fairness, guilt neutrality, student privacy rights, and tamper-evident cryptographic record-keeping.

---

## 🚀 Live Deployment Options

The project is structured as a unified full-stack application. In production, the Express backend serves both the API endpoints (`/api/*`) and the built React frontend (`client/dist`).

### Option 1: 1-Click Deployment on Render.com (Recommended & Free)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit of EduGuard"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```
2. Go to [Render.com](https://render.com) and log in.
3. Click **New +** → **Web Service**.
4. Connect your GitHub repository.
5. Set the following settings:
   - **Name**: `eduguard-student-agent`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
6. Click **Deploy Web Service**.
7. Render will build the app and give you a live HTTPS public link (e.g., `https://eduguard-student-agent.onrender.com`).

---

### Option 2: Deploy on Railway.app (Instant & Free)

1. Push your code to GitHub (as in Option 1).
2. Go to [Railway.app](https://railway.app) and sign in with GitHub.
3. Click **New Project** → **Deploy from GitHub repo**.
4. Select your repository. Railway automatically detects the Node.js project, builds the client, and launches the server.
5. Under service settings, click **Generate Domain** to get your public URL.

---

### Option 3: Instant Live Link Right Now (Without Cloud Accounts)

If you need a public URL immediately (e.g. for testing or live demonstrations):

1. Start the server:
   ```bash
   npm run build
   npm start
   ```
2. In a separate terminal, run:
   ```bash
   npx localtunnel --port 5000
   ```
   *or with ngrok:*
   ```bash
   npx ngrok http 5000
   ```
3. It will output a public HTTPS link (e.g., `https://eduguard-demo.loca.lt`) accessible from any browser, phone, or computer.

---

## 💻 Local Development

### Running with Dev Server (Hot-Reload)
1. **Start Backend Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Start Frontend (Vite)**:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser. Vite proxies `/api` calls directly to the Express server at `http://localhost:5000`.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Custom CSS Design System
- **Backend**: Node.js, Express 5
- **Database**: Local JSON persistence (`server/data/eduguard.json`) with auto-seeding
- **Integrations**: Multi-agent incident ingestion, procedural checklist gates, and SHA-256 cryptographic audit hash chains

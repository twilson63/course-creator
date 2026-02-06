# Course Creator PoC

This repository contains a **minimal proof‑of‑concept** that turns a YouTube video into an interactive course page.

## What it does
1. **Back‑end (Node/Express)** –
   - fetches a transcript via a public endpoint,
   - splits it into approximate 1‑minute steps,
   - builds a `course.json` and generates the final HTML using the existing `course‑creator` CLI,
   - stores the JSON and HTML in an LMDB file (`data/courses.mdb`).
2. **Front‑end (React + Vite)** –
   - list all saved courses,
   - create a new course by pasting a YouTube URL,
   - preview the generated HTML in an iframe,
   - edit the underlying JSON with a Monaco editor and save changes.

## How to run locally
```bash
# 1️⃣ Clone this repo (you already have it in the workspace)
cd course-creator-poc

# 2️⃣ Install back‑end deps and build the original CLI
npm install               # installs backend deps
npm run setup             # clones the original repo, runs its `npm ci` and `npm run build`

# 3️⃣ Start the Express API (runs on port 3000)
npm run dev               # runs `node src/server/index.ts`
# OR `npm run start` after a compile (`npm run build`)

# 4️⃣ In another terminal, install front‑end deps
cd frontend
npm install
npm run dev               # Vite dev server (http://localhost:5173) proxies /api to http://localhost:3000
```

Open **http://localhost:5173** in a browser – you’ll see the Course Dashboard. Click **Create New Course**, paste a YouTube link, and the system will generate a course you can preview and edit.

## Project layout
```
course-creator-poc/
├─ src/                # back‑end source (Express + LMDB)
│   ├─ server/
│   │   ├─ index.ts   # API routes (create, list, preview, edit, delete)
│   │   ├─ db.ts      # LMDB wrapper
│   │   └─ utils.ts   # transcript fetch & HTML generation
├─ frontend/           # React front‑end (Vite)
│   ├─ src/
│   │   ├─ App.tsx
│   │   ├─ pages/
│   │   │   ├─ CourseList.tsx
│   │   │   ├─ CreateCourse.tsx
│   │   │   └─ EditCourse.tsx
│   │   └─ index.css
│   ├─ index.html
│   └─ vite.config.ts (proxy /api to backend)
└─ data/               # LMDB file (auto‑created on first run)
```

Feel free to extend this PoC with real authentication, richer step‑splitting, or a visual drag‑and‑drop editor. Happy hacking!
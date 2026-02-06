import express from "express";
import { Courses, HtmlCache, db } from "./db";
import { generateCourseFromYouTube } from "./utils";

const app = express();
app.use(express.json());

// ---------- Helpers ----------
function makeId() {
  // Use crypto.randomUUID if available
  return `course-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}

// ---------- API ----------
app.post("/api/create", async (req, res) => {
  const { youtubeUrl } = req.body;
  if (!youtubeUrl) return res.status(400).json({ error: "youtubeUrl required" });
  try {
    const { courseJson, html } = await generateCourseFromYouTube(youtubeUrl);
    const id = makeId();
    db.transaction(() => {
      Courses.put(id, JSON.stringify(courseJson));
      HtmlCache.put(id, html);
    });
    res.json({ id, courseJson, previewUrl: `/api/preview/${id}` });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/preview/:id", (req, res) => {
  const html = HtmlCache.getString(req.params.id);
  if (!html) return res.status(404).send("Not found");
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

app.get("/api/course/:id", (req, res) => {
  const raw = Courses.getString(req.params.id);
  if (!raw) return res.status(404).json({ error: "Not found" });
  res.json(JSON.parse(raw));
});

app.put("/api/course/:id", async (req, res) => {
  const { id } = req.params;
  const newJson = req.body;
  try {
    // Re‑use the existing HTML builder (skip transcript fetch)
    const { buildHtmlFromJson } = await import("./utils");
    const html = await buildHtmlFromJson(newJson);
    db.transaction(() => {
      Courses.put(id, JSON.stringify(newJson));
      HtmlCache.put(id, html);
    });
    res.json({ success: true, previewUrl: `/api/preview/${id}` });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Delete a course (optional for PoC)
app.delete("/api/course/:id", (req, res) => {
  const { id } = req.params;
  db.transaction(() => {
    Courses.remove(id);
    HtmlCache.remove(id);
  });
  res.json({ success: true });
});

app.get("/api/courses", (req, res) => {
  // Return a simple list of IDs + meta titles
  const list: any[] = [];
  for (const [key, val] of Courses.getRange()) {
    const data = JSON.parse(val);
    list.push({ id: key, title: data.meta?.title ?? "(no title)" });
  }
  res.json(list);
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`🚀 PoC server listening on http://localhost:${PORT}`));

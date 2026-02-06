import fetch from "node-fetch";
import { spawn } from "child_process";
import path from "path";
import { writeFile } from "fs/promises";

/** Extract YouTube video ID from a URL */
function getVideoId(url: string): string {
  const match = url.match(/[?&]v=([^&#]+)/) ?? url.match(/youtu\.be\/([^?&#]+)/);
  if (!match) throw new Error("Could not parse YouTube video ID");
  return match[1];
}

/** Simple transcript fetch – uses the public lemnoslife endpoint */
export async function fetchTranscript(youtubeUrl: string): Promise<string> {
  const videoId = getVideoId(youtubeUrl);
  const resp = await fetch(`https://yt.lemnoslife.com/videos/${videoId}`);
  if (!resp.ok) throw new Error(`Transcript fetch failed (${resp.status})`);
  const data = await resp.json();
  const transcript = data.captions?.map((c: any) => c.text).join(" ") ?? "";
  if (!transcript) throw new Error("Empty transcript");
  return transcript;
}

/** Very naïve chunking into ~1‑minute steps */
function chunkTranscript(transcript: string, videoUrl: string) {
  const words = transcript.split(/\s+/);
  const chunkSize = 150; // approx 1 min of speech
  const steps: any[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    const startSec = Math.floor((i / words.length) * 3600);
    const endSec = Math.floor(((i + chunkSize) / words.length) * 3600);
    steps.push({
      id: `step-${i / chunkSize + 1}`,
      title: `Section ${i / chunkSize + 1}`,
      videoUrl,
      videoTimestamp: `${Math.floor(startSec / 60)}:${String(startSec % 60).padStart(2, "0")}`,
      videoEndTimestamp: `${Math.floor(endSec / 60)}:${String(endSec % 60).padStart(2, "0")}`,
      content: `./generated/step-${i / chunkSize + 1}.md`,
      estimatedTime: "1 min",
      checkpoint: { label: "I completed this step", hint: "Review the above content." }
    });
  }
  return steps;
}

/** Build HTML using the compiled CLI from the cloned original repo */
export const buildHtmlFromJson = async (courseJson: any): Promise<string> => {
  // Write a temporary JSON file
  const tmpPath = path.join(process.cwd(), "tmp-course.json");
  await writeFile(tmpPath, JSON.stringify(courseJson, null, 2), "utf8");

  // Path to the CLI that was built during the Docker build step
  const cliPath = path.resolve(process.cwd(), "repo/dist/cli/index.js");

  return new Promise<string>((resolve, reject) => {
    const child = spawn("node", [cliPath, "build", tmpPath, "-o", "-", "--standalone"], {
      stdio: ["ignore", "pipe", "pipe"]
    });
    let out = "";
    let err = "";
    child.stdout.on("data", d => (out += d.toString()));
    child.stderr.on("data", d => (err += d.toString()));
    child.on("close", code => {
      if (code === 0) resolve(out);
      else reject(new Error(`CLI build failed (code ${code}): ${err}`));
    });
  });
};

/** Main helper – given a YouTube URL, returns JSON + HTML */
export async function generateCourseFromYouTube(youtubeUrl: string) {
  const transcript = await fetchTranscript(youtubeUrl);
  const steps = chunkTranscript(transcript, youtubeUrl);
  const courseJson = {
    meta: {
      title: "Generated from YouTube",
      description: `Auto‑generated course from ${youtubeUrl}`,
      author: "You",
      estimatedTime: `${steps.length} min`,
      difficulty: "beginner"
    },
    steps,
    resources: []
  };
  const html = await buildHtmlFromJson(courseJson);
  return { courseJson, html };
}

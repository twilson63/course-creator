# OpenCode Course Creator

Generate interactive video courses from transcripts using AI.

## Quick Start

### 1. Create Course JSON

Define your course structure in a JSON file:

```json
{
  "meta": {
    "title": "Your Course Title",
    "description": "Brief description of the course",
    "author": "Your Name",
    "estimatedTime": "15 minutes",
    "difficulty": "beginner|intermediate|advanced"
  },
  "steps": [
    {
      "id": "step-1",
      "title": "Section Title",
      "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
      "videoTimestamp": "0:30",
      "videoEndTimestamp": "2:00",
      "content": "./steps/01-section.md",
      "estimatedTime": "3 minutes",
      "checkpoint": {
        "label": "I completed this step",
        "hint": "Here's what you should have done..."
      }
    }
  ],
  "resources": [
    {
      "label": "Resource Name",
      "url": "https://example.com/resource"
    }
  ]
}
```

### 2. Write Step Content

Create markdown files for each step:

```markdown
# Step Title

## What you'll do

- Create an agent
- Configure settings
- Test the result

## Instructions

1. First, do this...
2. Then, do that...
3. Finally, verify...

## Tips

- Use the checkpoint to mark completion
- Hover over the hint for help
```

### 3. Build Course

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Generate HTML
node dist/cli/index.js build course.json -o output/index.html --standalone
```

### 4. Deploy to ZenBin

```bash
# Deploy to ZenBin
curl -X POST "https://zenbin.onrender.com/v1/pages/YOUR_COURSE_ID" \
  -H "Content-Type: application/json" \
  -d "{\"encoding\": \"base64\", \"html\": \"$(cat output/index.html | base64 | tr -d '\n')\", \"title\": \"Your Course Title\"}"
```

**View your course:**
https://zenbin.onrender.com/p/YOUR_COURSE_ID

## JSON Schema Reference

### Meta Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Course title displayed in header |
| `description` | string | Yes | Course description for metadata |
| `author` | string | Yes | Course author name |
| `estimatedTime` | string | Yes | Time estimate (e.g., "15 minutes") |
| `difficulty` | string | Yes | One of: beginner, intermediate, advanced |

### Steps Array

Each step object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the step |
| `title` | string | Yes | Step title displayed in UI |
| `videoUrl` | string | Yes | YouTube, Loom, Vimeo, or Descript URL |
| `videoTimestamp` | string | Yes | Start time (e.g., "0:30", "90") |
| `videoEndTimestamp` | string | No | End time for YouTube segments |
| `content` | string | Yes | Path to markdown file with instructions |
| `estimatedTime` | string | Yes | Time estimate for this step |
| `checkpoint` | object | Yes | Progress checkpoint for the step |

### Checkpoint Object

```json
{
  "label": "I completed this step",
  "hint": "Optional help text that appears on hover"
}
```

### Resources Array

```json
{
  "label": "Resource Name",
  "url": "https://example.com/resource"
}
```

## Video Provider Support

| Provider | Segments | Auto-Advance | Notes |
|----------|----------|--------------|-------|
| YouTube | ✅ Yes | ✅ Yes | Full feature support |
| Loom | ❌ No | ❌ No | Start timestamp only |
| Vimeo | ❌ No | ❌ No | Start timestamp only |
| Descript | ❌ No | ❌ No | Start timestamp only |

**Important:** YouTube iframe API requires HTTP/HTTPS. Test via ZenBin or local server.

## AI Agent Integration

For AI agent harnesses like OpenCode:

### Input
- Video URL (YouTube, Loom, Vimeo, Descript)
- Transcript text
- Course metadata (title, description, author)

### Processing
1. Parse transcript into logical sections
2. Create step markdown files
3. Generate course.json with timestamps
4. Execute: `node dist/cli/index.js build course.json -o output/index.html --standalone`
5. Deploy: `curl -X POST ...` to ZenBin

### Output
- Generated HTML file
- ZenBin URL
- Course preview link

## Examples

See `examples/scout-transcripts/` for a complete course implementation.

## CLI Commands

```bash
# Build course
node dist/cli/index.js build <course.json> -o <output.html> [options]

# Options
--standalone    Inline all CSS/JS for deployment
--watch         Watch for file changes and rebuild

# Development
npm run build   # Compile TypeScript
npm run dev     # Watch mode compilation
```

## License

MIT
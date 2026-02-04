# twilson63/skills

A collection of skills for opencode.

## What are Skills?

Skills are specialized instructions that give AI agents detailed knowledge and step-by-step guidance for specific tasks. They provide the context and tools needed to work effectively with particular technologies, APIs, or workflows.

## Available Skills

### zenbin
A skill for publishing HTML pages to [ZenBin](https://zenbin.onrender.com) using the ZenBin API. ZenBin is a simple service that lets you publish HTML pages to unique URLs that can be shared or viewed in a browser.

**Features:**
- Publish HTML content with base64 encoding support
- Optional page authentication (password or URL token)
- Built-in proxy API for external calls
- Custom page titles and content types

## Installation

Install the zenbin skill:

```bash
npx skills add https://github.com/twilson63/skills --skill zenbin
```

This will make the zenbin skill available to opencode, allowing you to request ZenBin-related tasks like publishing HTML pages.

## Usage

Once installed, you can ask opencode to help you with ZenBin tasks:

```
Publish this HTML to ZenBin with ID "my-page"
```

The zenbin skill will provide detailed instructions on:
- How to structure the API request
- Encoding options (UTF-8 vs base64)
- Authentication methods
- Using the proxy API for external calls

## Project Structure

```
skills/
└── zenbin/
    └── SKILL.md
```

Each skill has its own directory with a `SKILL.md` file containing the instructions.

## Contributing

To add a new skill:

1. Create a new directory in `skills/`
2. Add a `SKILL.md` file with detailed instructions
3. Follow the existing skill structure

## License

MIT
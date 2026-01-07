/**
 * Markdown processor with syntax highlighting
 */

import { Marked, Tokens } from 'marked';
import hljs from 'highlight.js';

// Configure marked with syntax highlighting
const marked = new Marked({
  gfm: true,
  breaks: false,
});

// Custom renderer for code blocks with highlighting
marked.use({
  renderer: {
    code(token: Tokens.Code): string {
      const code = token.text;
      const lang = token.lang || 'plaintext';
      let highlighted: string;
      
      try {
        if (lang && hljs.getLanguage(lang)) {
          highlighted = hljs.highlight(code, { language: lang }).value;
        } else {
          highlighted = hljs.highlightAuto(code).value;
        }
      } catch {
        highlighted = escapeHtml(code);
      }
      
      return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    },
  },
});

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Process markdown content to HTML
 */
export function processMarkdown(content: string): string {
  return marked.parse(content) as string;
}

/**
 * Extract title from markdown (first h1)
 */
export function extractTitle(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

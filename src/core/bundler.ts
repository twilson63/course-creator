/**
 * Bundler - Creates a single HTML file with embedded React app
 */

import * as fs from 'fs';
import * as path from 'path';
import * as esbuild from 'esbuild';
import { ProcessedCourse } from '../types/course.js';

// Read the template files
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Get the CSS styles for the course
 */
function getStyles(): string {
  // Try to read from source directory first (dev mode)
  const srcPath = path.resolve(__dirname, '../template/styles/index.css');
  if (fs.existsSync(srcPath)) {
    return fs.readFileSync(srcPath, 'utf-8');
  }
  
  // Fall back to dist directory
  const distPath = path.resolve(__dirname, '../../src/template/styles/index.css');
  if (fs.existsSync(distPath)) {
    return fs.readFileSync(distPath, 'utf-8');
  }
  
  // Fall back to inline styles
  return getInlineStyles();
}

/**
 * Fallback inline styles if file can't be loaded
 */
function getInlineStyles(): string {
  return `
/* Course Creator Styles - Inline Fallback */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-primary: #FAFAFA;
  --bg-card: #FFFFFF;
  --bg-code: #1E1E1E;
  --text-primary: #1A1A1A;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  --border: #E5E7EB;
  --border-light: #F3F4F6;
  --accent: #3B82F6;
  --accent-hover: #2563EB;
  --success: #10B981;
  --success-light: #D1FAE5;
  --font-sans: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; }
body { font-family: var(--font-sans); background: var(--bg-primary); color: var(--text-primary); line-height: 1.6; }
.course-container { max-width: 800px; margin: 0 auto; padding: var(--spacing-xl); min-height: 100vh; }
.course-header { text-align: center; margin-bottom: var(--spacing-2xl); padding-bottom: var(--spacing-xl); border-bottom: 1px solid var(--border); }
.course-title { font-size: 2rem; font-weight: 700; margin-bottom: var(--spacing-sm); }
.course-description { font-size: 1.125rem; color: var(--text-secondary); }
.course-meta { display: flex; justify-content: center; gap: var(--spacing-lg); margin-top: var(--spacing-md); font-size: 0.875rem; color: var(--text-muted); }
.progress-container { margin-bottom: var(--spacing-xl); }
.progress-header { display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm); font-size: 0.875rem; color: var(--text-secondary); }
.progress-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: var(--success); transition: width 0.3s; }
.step-nav { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl); justify-content: center; }
.step-nav-item { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--border); background: var(--bg-card); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; font-weight: 500; }
.step-nav-item:hover { border-color: var(--accent); color: var(--accent); }
.step-nav-item.active { border-color: var(--accent); background: var(--accent); color: white; }
.step-nav-item.completed { border-color: var(--success); background: var(--success); color: white; }
.step-card { background: var(--bg-card); border-radius: var(--radius-xl); box-shadow: var(--shadow-md); overflow: hidden; margin-bottom: var(--spacing-xl); }
.step-header { padding: var(--spacing-lg) var(--spacing-xl); border-bottom: 1px solid var(--border-light); }
.step-indicator { font-size: 0.75rem; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; }
.step-title { font-size: 1.5rem; font-weight: 600; }
.video-container { position: relative; width: 100%; padding-bottom: 56.25%; background: #000; }
.video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
.video-placeholder { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #1a1a1a; color: var(--text-muted); }
.step-body { padding: var(--spacing-xl); }
.markdown-content h2 { font-size: 1.25rem; font-weight: 600; margin: var(--spacing-xl) 0 var(--spacing-md); }
.markdown-content p { margin-bottom: var(--spacing-md); }
.markdown-content ul, .markdown-content ol { margin-bottom: var(--spacing-md); padding-left: var(--spacing-lg); }
.markdown-content li { margin-bottom: var(--spacing-sm); }
.markdown-content a { color: var(--accent); }
.markdown-content blockquote { border-left: 4px solid var(--accent); padding-left: var(--spacing-md); margin: var(--spacing-md) 0; color: var(--text-secondary); }
.markdown-content code { font-family: var(--font-mono); font-size: 0.875em; background: var(--border-light); padding: 0.2em 0.4em; border-radius: var(--radius-sm); }
.markdown-content pre { background: var(--bg-code); border-radius: var(--radius-md); padding: var(--spacing-md); overflow-x: auto; margin: var(--spacing-md) 0; }
.markdown-content pre code { background: none; padding: 0; color: #e5e5e5; }
.checkpoint { margin-top: var(--spacing-xl); padding: var(--spacing-lg); background: var(--bg-primary); border-radius: var(--radius-lg); border: 2px solid var(--border); }
.checkpoint.completed { border-color: var(--success); background: var(--success-light); }
.checkpoint-label { display: flex; align-items: center; gap: var(--spacing-md); cursor: pointer; }
.checkpoint-checkbox { width: 24px; height: 24px; border: 2px solid var(--border); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; background: var(--bg-card); }
.checkpoint-checkbox.checked { background: var(--success); border-color: var(--success); }
.checkpoint-checkbox svg { width: 14px; height: 14px; stroke: white; stroke-width: 3; opacity: 0; }
.checkpoint-checkbox.checked svg { opacity: 1; }
.checkpoint-text { font-weight: 500; }
.checkpoint-hint { font-size: 0.875rem; color: var(--text-muted); margin-top: var(--spacing-xs); margin-left: calc(24px + var(--spacing-md)); }
.step-navigation { display: flex; justify-content: space-between; padding: var(--spacing-lg) var(--spacing-xl); border-top: 1px solid var(--border-light); background: var(--bg-primary); }
.nav-button { display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-sm) var(--spacing-lg); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 0.875rem; font-weight: 500; cursor: pointer; }
.nav-button.secondary { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary); }
.nav-button.secondary:hover { border-color: var(--text-secondary); }
.nav-button.primary { background: var(--accent); border: 1px solid var(--accent); color: white; }
.nav-button.primary:hover { background: var(--accent-hover); }
.nav-button:disabled { opacity: 0.5; cursor: not-allowed; }
.nav-button svg { width: 16px; height: 16px; }
.completion-screen { text-align: center; padding: var(--spacing-2xl); }
.completion-icon { width: 80px; height: 80px; background: var(--success-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--spacing-xl); }
.completion-icon svg { width: 40px; height: 40px; stroke: var(--success); stroke-width: 2; }
.completion-title { font-size: 1.75rem; font-weight: 700; margin-bottom: var(--spacing-sm); }
.completion-message { font-size: 1.125rem; color: var(--text-secondary); margin-bottom: var(--spacing-xl); }
.restart-button { display: inline-flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-sm) var(--spacing-xl); background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 0.875rem; font-weight: 500; cursor: pointer; }
.resources-section { margin-top: var(--spacing-2xl); padding-top: var(--spacing-xl); border-top: 1px solid var(--border); }
.resources-title { font-size: 1rem; font-weight: 600; color: var(--text-secondary); margin-bottom: var(--spacing-md); }
.resources-list { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); }
.resource-link { display: inline-flex; align-items: center; gap: var(--spacing-xs); padding: var(--spacing-xs) var(--spacing-md); background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); font-size: 0.875rem; color: var(--text-secondary); text-decoration: none; }
.resource-link:hover { border-color: var(--accent); color: var(--accent); }
.resource-link svg { width: 14px; height: 14px; }
@media (max-width: 640px) { .course-container { padding: var(--spacing-md); } .course-title { font-size: 1.5rem; } .step-header, .step-body, .step-navigation { padding: var(--spacing-md); } }
.hljs-keyword, .hljs-selector-tag { color: #569cd6; }
.hljs-string, .hljs-title { color: #ce9178; }
.hljs-comment { color: #6a9955; }
.hljs-number { color: #b5cea8; }
.hljs-variable { color: #9cdcfe; }
  `.trim();
}

/**
 * Get the React app JavaScript (inlined and bundled)
 */
function getAppScript(): string {
  // The React app logic - self-contained without imports
  return `
(function() {
  'use strict';
  
  const { useState, useEffect, useCallback, createElement: h } = React;

  // Icons
  const CheckIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' },
    h('polyline', { points: '20 6 9 17 4 12' })
  );

  const ChevronLeft = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    h('polyline', { points: '15 18 9 12 15 6' })
  );

  const ChevronRight = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    h('polyline', { points: '9 18 15 12 9 6' })
  );

  const ClockIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', style: { width: 16, height: 16 } },
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('polyline', { points: '12 6 12 12 16 14' })
  );

  const ExternalLinkIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    h('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
    h('polyline', { points: '15 3 21 3 21 9' }),
    h('line', { x1: '10', y1: '14', x2: '21', y2: '3' })
  );

  const TrophyIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
    h('path', { d: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6' }),
    h('path', { d: 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18' }),
    h('path', { d: 'M4 22h16' }),
    h('path', { d: 'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22' }),
    h('path', { d: 'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22' }),
    h('path', { d: 'M18 2H6v7a6 6 0 0 0 12 0V2Z' })
  );

  const RefreshIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', style: { width: 16, height: 16 } },
    h('path', { d: 'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8' }),
    h('path', { d: 'M21 3v5h-5' }),
    h('path', { d: 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16' }),
    h('path', { d: 'M8 16H3v5' })
  );

  // Progress Hook
  function useProgress(courseId, totalSteps) {
    const storageKey = 'course-progress-' + courseId;
    
    const [progress, setProgress] = useState(() => {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try { return JSON.parse(stored); } catch {}
      }
      return {
        courseId,
        currentStepIndex: 0,
        completedStepIds: [],
        startedAt: new Date().toISOString(),
        lastVisitedAt: new Date().toISOString(),
      };
    });

    useEffect(() => {
      localStorage.setItem(storageKey, JSON.stringify({
        ...progress,
        lastVisitedAt: new Date().toISOString(),
      }));
    }, [progress, storageKey]);

    const goToStep = useCallback((index) => {
      if (index >= 0 && index < totalSteps) {
        setProgress(prev => ({ ...prev, currentStepIndex: index }));
      }
    }, [totalSteps]);

    const markComplete = useCallback((stepId) => {
      setProgress(prev => {
        if (prev.completedStepIds.includes(stepId)) return prev;
        return { ...prev, completedStepIds: [...prev.completedStepIds, stepId] };
      });
    }, []);

    const markIncomplete = useCallback((stepId) => {
      setProgress(prev => ({
        ...prev,
        completedStepIds: prev.completedStepIds.filter(id => id !== stepId),
      }));
    }, []);

    const reset = useCallback(() => {
      setProgress({
        courseId,
        currentStepIndex: 0,
        completedStepIds: [],
        startedAt: new Date().toISOString(),
        lastVisitedAt: new Date().toISOString(),
      });
    }, [courseId]);

    return {
      currentStepIndex: progress.currentStepIndex,
      completedStepIds: progress.completedStepIds,
      goToStep,
      markComplete,
      markIncomplete,
      reset,
    };
  }

  // Video Player
  function VideoPlayer({ embedUrl }) {
    if (!embedUrl) {
      return h('div', { className: 'video-container' },
        h('div', { className: 'video-placeholder' }, 'No video for this step')
      );
    }
    return h('div', { className: 'video-container' },
      h('iframe', {
        src: embedUrl,
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        allowFullScreen: true
      })
    );
  }

  // Checkpoint
  function Checkpoint({ checkpoint, isChecked, onToggle }) {
    return h('div', { className: 'checkpoint ' + (isChecked ? 'completed' : '') },
      h('label', { className: 'checkpoint-label', onClick: onToggle },
        h('div', { className: 'checkpoint-checkbox ' + (isChecked ? 'checked' : '') },
          h(CheckIcon)
        ),
        h('span', { className: 'checkpoint-text' }, checkpoint.label)
      ),
      checkpoint.hint && !isChecked && h('p', { className: 'checkpoint-hint' }, checkpoint.hint)
    );
  }

  // Step View
  function StepView({ step, stepNumber, totalSteps, isCompleted, onComplete, onIncomplete, onPrevious, onNext, hasPrevious, hasNext }) {
    return h('div', { className: 'step-card' },
      h('div', { className: 'step-header' },
        h('div', { className: 'step-indicator' }, 'Step ' + stepNumber + ' of ' + totalSteps),
        h('h2', { className: 'step-title' }, step.title),
        step.estimatedTime && h('div', { className: 'step-time' }, h(ClockIcon), ' ', step.estimatedTime)
      ),
      h(VideoPlayer, { embedUrl: step.videoEmbedUrl }),
      h('div', { className: 'step-body' },
        h('div', { className: 'markdown-content', dangerouslySetInnerHTML: { __html: step.contentHtml } }),
        step.checkpoint && h(Checkpoint, {
          checkpoint: step.checkpoint,
          isChecked: isCompleted,
          onToggle: () => isCompleted ? onIncomplete() : onComplete()
        })
      ),
      h('div', { className: 'step-navigation' },
        h('button', { className: 'nav-button secondary', onClick: onPrevious, disabled: !hasPrevious },
          h(ChevronLeft), ' Previous'
        ),
        h('button', { className: 'nav-button primary', onClick: onNext, disabled: !hasNext },
          'Next ', h(ChevronRight)
        )
      )
    );
  }

  // Completion Screen
  function CompletionScreen({ courseName, onRestart }) {
    return h('div', { className: 'step-card' },
      h('div', { className: 'completion-screen' },
        h('div', { className: 'completion-icon' }, h(TrophyIcon)),
        h('h2', { className: 'completion-title' }, 'Congratulations!'),
        h('p', { className: 'completion-message' }, 'You\\'ve completed "' + courseName + '"'),
        h('button', { className: 'restart-button', onClick: onRestart },
          h(RefreshIcon), ' Start Over'
        )
      )
    );
  }

  // Progress Bar
  function ProgressBar({ completed, total }) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return h('div', { className: 'progress-container' },
      h('div', { className: 'progress-header' },
        h('span', null, 'Progress'),
        h('span', null, completed + ' of ' + total + ' steps complete')
      ),
      h('div', { className: 'progress-bar' },
        h('div', { className: 'progress-fill', style: { width: percentage + '%' } })
      )
    );
  }

  // Step Navigation
  function StepNavigation({ steps, currentIndex, completedIds, onSelect }) {
    return h('nav', { className: 'step-nav' },
      steps.map((step, index) => {
        const isCompleted = completedIds.includes(step.id);
        const isCurrent = index === currentIndex;
        let className = 'step-nav-item';
        if (isCurrent) className += ' active';
        else if (isCompleted) className += ' completed';
        return h('button', {
          key: step.id,
          className,
          onClick: () => onSelect(index),
          title: step.title
        }, isCompleted && !isCurrent ? h(CheckIcon) : index + 1);
      })
    );
  }

  // Resources
  function Resources({ resources }) {
    if (!resources || resources.length === 0) return null;
    return h('div', { className: 'resources-section' },
      h('h3', { className: 'resources-title' }, 'Helpful Resources'),
      h('div', { className: 'resources-list' },
        resources.map((resource, index) =>
          h('a', {
            key: index,
            href: resource.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'resource-link'
          }, resource.label, ' ', h(ExternalLinkIcon))
        )
      )
    );
  }

  // Main App
  function CourseApp({ course }) {
    const courseId = course.meta.title.toLowerCase().replace(/\\s+/g, '-');
    const { currentStepIndex, completedStepIds, goToStep, markComplete, markIncomplete, reset } = useProgress(courseId, course.steps.length);
    const currentStep = course.steps[currentStepIndex];
    const allCompleted = completedStepIds.length === course.steps.length;

    return h('div', { className: 'course-container' },
      h('header', { className: 'course-header' },
        h('h1', { className: 'course-title' }, course.meta.title),
        h('p', { className: 'course-description' }, course.meta.description),
        h('div', { className: 'course-meta' },
          course.meta.estimatedTime && h('span', { className: 'course-meta-item' }, h(ClockIcon), ' ', course.meta.estimatedTime),
          course.meta.difficulty && h('span', { className: 'course-meta-item' }, course.meta.difficulty.charAt(0).toUpperCase() + course.meta.difficulty.slice(1)),
          course.meta.author && h('span', { className: 'course-meta-item' }, 'By ', course.meta.author)
        )
      ),
      h(ProgressBar, { completed: completedStepIds.length, total: course.steps.length }),
      h(StepNavigation, { steps: course.steps, currentIndex: currentStepIndex, completedIds: completedStepIds, onSelect: goToStep }),
      allCompleted && currentStepIndex === course.steps.length - 1
        ? h(CompletionScreen, { courseName: course.meta.title, onRestart: reset })
        : h(StepView, {
            step: currentStep,
            stepNumber: currentStepIndex + 1,
            totalSteps: course.steps.length,
            isCompleted: completedStepIds.includes(currentStep.id),
            onComplete: () => markComplete(currentStep.id),
            onIncomplete: () => markIncomplete(currentStep.id),
            onPrevious: () => goToStep(currentStepIndex - 1),
            onNext: () => goToStep(currentStepIndex + 1),
            hasPrevious: currentStepIndex > 0,
            hasNext: currentStepIndex < course.steps.length - 1
          }),
      h(Resources, { resources: course.resources })
    );
  }

  // Initialize app
  window.initCourseApp = function(course) {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(h(CourseApp, { course }));
  };
})();
  `.trim();
}

/**
 * Fetch and cache React libraries for standalone builds
 */
let reactCache: { react: string; reactDom: string } | null = null;

async function fetchReactLibraries(): Promise<{ react: string; reactDom: string }> {
  if (reactCache) return reactCache;
  
  console.log('   Fetching React libraries for standalone build...');
  
  const [reactRes, reactDomRes] = await Promise.all([
    fetch('https://unpkg.com/react@18/umd/react.production.min.js'),
    fetch('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'),
  ]);
  
  const [react, reactDom] = await Promise.all([
    reactRes.text(),
    reactDomRes.text(),
  ]);
  
  reactCache = { react, reactDom };
  return reactCache;
}

/**
 * Get styles with system fonts (for standalone builds)
 */
function getStandaloneStyles(): string {
  const styles = getStyles();
  // Replace Google Fonts import with system fonts
  return styles
    .replace(/@import url\([^)]+\);?/g, '')
    .replace(
      /--font-sans:[^;]+;/g,
      "--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;"
    )
    .replace(
      /--font-mono:[^;]+;/g,
      "--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;"
    );
}

export interface GenerateHtmlOptions {
  standalone?: boolean; // Inline React, use system fonts (no external deps)
}

/**
 * Generate a single HTML file containing the entire course app
 */
export async function generateHtml(course: ProcessedCourse, options: GenerateHtmlOptions = {}): Promise<string> {
  const { standalone = false } = options;
  
  const styles = standalone ? getStandaloneStyles() : getStyles();
  const script = getAppScript();
  const courseData = JSON.stringify(course, null, 2);
  
  if (standalone) {
    // Fully self-contained build - no external dependencies
    const { react, reactDom } = await fetchReactLibraries();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(course.meta.title)}</title>
  <meta name="description" content="${escapeHtml(course.meta.description)}">
  <style>
${styles}
  </style>
</head>
<body>
  <div id="root"></div>
  
  <!-- React (inlined) -->
  <script>${react}</script>
  <script>${reactDom}</script>
  
  <!-- Course App -->
  <script>
${script}
  </script>
  
  <!-- Course Data -->
  <script>
    const courseData = ${courseData};
    window.initCourseApp(courseData);
  </script>
</body>
</html>`;
  }
  
  // Standard build with CDN references
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(course.meta.title)}</title>
  <meta name="description" content="${escapeHtml(course.meta.description)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
${styles}
  </style>
</head>
<body>
  <div id="root"></div>
  
  <!-- React (production build) -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  
  <!-- Course App -->
  <script>
${script}
  </script>
  
  <!-- Course Data -->
  <script>
    const courseData = ${courseData};
    window.initCourseApp(courseData);
  </script>
</body>
</html>`;
}

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

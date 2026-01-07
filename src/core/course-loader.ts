/**
 * Course loader - reads and validates course definition files
 */

import * as fs from 'fs';
import * as path from 'path';
import { CourseDefinition, ProcessedCourse, ProcessedStep } from '../types/course.js';
import { processMarkdown } from './markdown.js';
import { getVideoEmbedUrl } from './video-embed.js';

/**
 * Load a course definition from a JSON file
 */
export function loadCourseDefinition(filePath: string): CourseDefinition {
  const absolutePath = path.resolve(filePath);
  const content = fs.readFileSync(absolutePath, 'utf-8');
  const course = JSON.parse(content) as CourseDefinition;
  
  // Validate required fields
  if (!course.meta?.title) {
    throw new Error('Course must have a meta.title');
  }
  if (!course.steps || course.steps.length === 0) {
    throw new Error('Course must have at least one step');
  }
  
  return course;
}

/**
 * Load markdown content for a step
 * Content can be a file path (relative to course.json) or inline markdown
 */
function loadStepContent(content: string, basePath: string): string {
  // Check if it's a file path
  if (content.endsWith('.md') || content.startsWith('./') || content.startsWith('../')) {
    const filePath = path.resolve(basePath, content);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
    console.warn(`Warning: Step content file not found: ${filePath}`);
    return `*Content file not found: ${content}*`;
  }
  
  // It's inline markdown
  return content;
}

/**
 * Process a course definition into a fully rendered course
 */
export function processCourse(definition: CourseDefinition, basePath: string): ProcessedCourse {
  const steps: ProcessedStep[] = definition.steps.map((step, index) => {
    // Load markdown content
    const markdown = loadStepContent(step.content, basePath);
    const contentHtml = processMarkdown(markdown);
    
    // Process video URL
    let videoEmbedUrl: string | undefined;
    if (step.videoUrl) {
      const result = getVideoEmbedUrl(step.videoUrl, step.videoTimestamp);
      videoEmbedUrl = result?.embedUrl;
    }
    
    return {
      id: step.id || `step-${index + 1}`,
      title: step.title,
      videoEmbedUrl,
      contentHtml,
      estimatedTime: step.estimatedTime,
      checkpoint: step.checkpoint || {
        label: `I've completed "${step.title}"`,
      },
    };
  });
  
  return {
    meta: definition.meta,
    steps,
    resources: definition.resources,
  };
}

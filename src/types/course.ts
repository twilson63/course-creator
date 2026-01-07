/**
 * Course data types
 */

export interface CourseMeta {
  title: string;
  description: string;
  author?: string;
  estimatedTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  icon?: string;
}

export interface StepCheckpoint {
  label: string;
  hint?: string;
}

export interface CourseStep {
  id: string;
  title: string;
  videoUrl?: string;
  videoTimestamp?: string; // e.g., "1:30" or "90" (seconds)
  content: string; // Path to markdown file OR inline markdown
  estimatedTime?: string;
  checkpoint?: StepCheckpoint;
}

export interface CourseResource {
  label: string;
  url: string;
  description?: string;
}

export interface CourseDefinition {
  meta: CourseMeta;
  steps: CourseStep[];
  transcript?: string; // Path to transcript file
  resources?: CourseResource[];
}

/**
 * Processed course data (ready for rendering)
 */

export interface ProcessedStep {
  id: string;
  title: string;
  videoEmbedUrl?: string;
  contentHtml: string;
  estimatedTime?: string;
  checkpoint?: StepCheckpoint;
}

export interface ProcessedCourse {
  meta: CourseMeta;
  steps: ProcessedStep[];
  resources?: CourseResource[];
}

/**
 * Progress tracking (stored in LocalStorage)
 */

export interface CourseProgress {
  courseId: string;
  currentStepIndex: number;
  completedStepIds: string[];
  startedAt: string;
  lastVisitedAt: string;
}

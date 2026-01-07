#!/usr/bin/env node

/**
 * Course Creator CLI
 * Generate single-page video-driven course web apps
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { loadCourseDefinition, processCourse } from '../core/course-loader.js';
import { generateHtml } from '../core/bundler.js';

const program = new Command();

program
  .name('course-creator')
  .description('CLI tool to generate single-page video-driven course web apps')
  .version('1.0.0');

/**
 * Build command - Generate HTML from course definition
 */
program
  .command('build')
  .description('Generate a single HTML file from a course definition')
  .argument('<course>', 'Path to course.json file')
  .option('-o, --output <path>', 'Output file path', './dist/index.html')
  .option('-s, --standalone', 'Generate fully self-contained HTML (inlines React, uses system fonts)')
  .action(async (coursePath: string, options: { output: string; standalone?: boolean }) => {
    try {
      console.log('📚 Loading course definition...');
      const absoluteCoursePath = path.resolve(coursePath);
      const basePath = path.dirname(absoluteCoursePath);
      
      const definition = loadCourseDefinition(absoluteCoursePath);
      console.log(`   Found: "${definition.meta.title}" with ${definition.steps.length} steps`);
      
      console.log('⚙️  Processing course content...');
      const processedCourse = processCourse(definition, basePath);
      
      console.log('📦 Generating HTML...');
      if (options.standalone) {
        console.log('   Mode: Standalone (no external dependencies)');
      }
      const html = await generateHtml(processedCourse, { standalone: options.standalone });
      
      // Ensure output directory exists
      const outputPath = path.resolve(options.output);
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      fs.writeFileSync(outputPath, html, 'utf-8');
      
      const stats = fs.statSync(outputPath);
      const sizeKb = (stats.size / 1024).toFixed(1);
      
      console.log('');
      console.log('✅ Course generated successfully!');
      console.log(`   Output: ${outputPath}`);
      console.log(`   Size: ${sizeKb} KB`);
      console.log('');
      console.log('🚀 To preview, open the file in a browser or run:');
      console.log(`   npx serve ${outputDir}`);
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Init command - Create a new course project
 */
program
  .command('init')
  .description('Initialize a new course project with example files')
  .argument('<name>', 'Name of the course directory')
  .action(async (name: string) => {
    try {
      const courseDir = path.resolve(name);
      
      if (fs.existsSync(courseDir)) {
        console.error(`❌ Directory "${name}" already exists`);
        process.exit(1);
      }
      
      console.log(`📁 Creating course directory: ${name}`);
      fs.mkdirSync(courseDir, { recursive: true });
      fs.mkdirSync(path.join(courseDir, 'steps'), { recursive: true });
      
      // Create example course.json
      const courseJson = {
        meta: {
          title: "My Course Title",
          description: "A brief description of what you'll learn in this course",
          author: "Your Name",
          estimatedTime: "15 minutes",
          difficulty: "beginner"
        },
        steps: [
          {
            id: "introduction",
            title: "Introduction",
            videoUrl: "https://www.loom.com/share/YOUR_VIDEO_ID",
            videoTimestamp: "0:00",
            content: "./steps/01-introduction.md",
            estimatedTime: "2 minutes",
            checkpoint: {
              label: "I understand the course objectives",
              hint: "Watch the video and read through the introduction"
            }
          },
          {
            id: "step-2",
            title: "Your First Task",
            videoUrl: "https://www.loom.com/share/YOUR_VIDEO_ID",
            videoTimestamp: "2:00",
            content: "./steps/02-first-task.md",
            estimatedTime: "5 minutes",
            checkpoint: {
              label: "I've completed my first task"
            }
          }
        ],
        resources: [
          {
            label: "Documentation",
            url: "https://example.com/docs"
          }
        ]
      };
      
      fs.writeFileSync(
        path.join(courseDir, 'course.json'),
        JSON.stringify(courseJson, null, 2),
        'utf-8'
      );
      
      // Create example step files
      const step1Content = `# Introduction

Welcome to this course! In this video, we'll cover what you'll learn.

## What You'll Learn

- How to do X
- How to do Y
- How to do Z

## Prerequisites

Before starting, make sure you have:

1. Prerequisite 1
2. Prerequisite 2

> **Tip:** Watch the video above to see a walkthrough of the entire process.

Ready to get started? Check the box below and move to the next step!
`;

      const step2Content = `# Your First Task

Now let's put what you learned into practice!

## Instructions

1. Open your application
2. Navigate to the settings
3. Make the following change:

\`\`\`javascript
// Example code
const config = {
  enabled: true,
  mode: 'advanced'
};
\`\`\`

## What to Expect

After completing this step, you should see:

- Result 1
- Result 2

## Troubleshooting

If something doesn't work:

1. Check that you followed all the steps
2. Refresh the page
3. Try again

> **Note:** If you're still stuck, check out the resources at the bottom of the page.
`;

      fs.writeFileSync(path.join(courseDir, 'steps', '01-introduction.md'), step1Content, 'utf-8');
      fs.writeFileSync(path.join(courseDir, 'steps', '02-first-task.md'), step2Content, 'utf-8');
      
      console.log('');
      console.log('✅ Course project created!');
      console.log('');
      console.log('📁 Project structure:');
      console.log(`   ${name}/`);
      console.log('   ├── course.json');
      console.log('   └── steps/');
      console.log('       ├── 01-introduction.md');
      console.log('       └── 02-first-task.md');
      console.log('');
      console.log('📝 Next steps:');
      console.log(`   1. Edit ${name}/course.json to customize your course`);
      console.log(`   2. Update the markdown files in ${name}/steps/`);
      console.log('   3. Add your Loom/YouTube video URLs');
      console.log(`   4. Run: course-creator build ${name}/course.json`);
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

/**
 * Dev command - Watch for changes and rebuild
 */
program
  .command('dev')
  .description('Watch for changes and rebuild automatically')
  .argument('<course>', 'Path to course.json file')
  .option('-o, --output <path>', 'Output file path', './dist/index.html')
  .option('-p, --port <port>', 'Port for preview server', '3000')
  .action(async (coursePath: string, options: { output: string; port: string }) => {
    try {
      const absoluteCoursePath = path.resolve(coursePath);
      const basePath = path.dirname(absoluteCoursePath);
      const outputPath = path.resolve(options.output);
      
      const build = async () => {
        try {
          const definition = loadCourseDefinition(absoluteCoursePath);
          const processedCourse = processCourse(definition, basePath);
          const html = await generateHtml(processedCourse);
          
          const outputDir = path.dirname(outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          fs.writeFileSync(outputPath, html, 'utf-8');
          console.log(`[${new Date().toLocaleTimeString()}] ✅ Rebuilt: ${outputPath}`);
        } catch (error) {
          console.error(`[${new Date().toLocaleTimeString()}] ❌ Error:`, error instanceof Error ? error.message : error);
        }
      };
      
      // Initial build
      console.log('👀 Starting development mode...');
      await build();
      
      // Watch for changes
      const { watch } = await import('chokidar');
      const watcher = watch([absoluteCoursePath, path.join(basePath, '**/*.md')], {
        ignoreInitial: true,
        ignored: /node_modules/,
      });
      
      watcher.on('change', (filePath) => {
        console.log(`   Changed: ${path.relative(basePath, filePath)}`);
        build();
      });
      
      watcher.on('add', (filePath) => {
        console.log(`   Added: ${path.relative(basePath, filePath)}`);
        build();
      });
      
      console.log('');
      console.log(`📁 Watching: ${basePath}`);
      console.log(`📄 Output: ${outputPath}`);
      console.log('');
      console.log('Press Ctrl+C to stop');
      console.log('');
      console.log('💡 To preview, run in another terminal:');
      console.log(`   npx serve ${path.dirname(outputPath)} -p ${options.port}`);
      
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();

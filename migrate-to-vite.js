#!/usr/bin/env node

/**
 * Migration script to help transition from Create React App to Vite
 * This script handles common migration tasks and cleanup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting migration from Create React App to Vite...\n');

// Files to remove (CRA-specific)
const filesToRemove = [
  'src/reportWebVitals.js',
  'src/setupTests.js',
  'src/App.test.js',
  'public/robots.txt'
];

// Clean up CRA-specific files
console.log('🧹 Cleaning up Create React App files...');
filesToRemove.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`   ✅ Removed: ${file}`);
    } catch (error) {
      console.log(`   ❌ Failed to remove: ${file} - ${error.message}`);
    }
  } else {
    console.log(`   ⚠️  File not found: ${file}`);
  }
});

// Update any remaining %PUBLIC_URL% references
console.log('\n🔧 Checking for remaining %PUBLIC_URL% references...');
const publicFiles = ['public/manifest.json'];

publicFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Replace %PUBLIC_URL% with empty string (Vite handles this automatically)
      content = content.replace(/%PUBLIC_URL%/g, '');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`   ✅ Updated: ${file}`);
      } else {
        console.log(`   ✅ No changes needed: ${file}`);
      }
    } catch (error) {
      console.log(`   ❌ Failed to update: ${file} - ${error.message}`);
    }
  }
});

// Create setupTests.js for Vitest if it doesn't exist
console.log('\n🔧 Setting up Vitest configuration...');
const setupTestsPath = path.join(__dirname, 'src/setupTests.js');
if (!fs.existsSync(setupTestsPath)) {
  const setupTestsContent = `// Vitest setup file
import '@testing-library/jest-dom';

// Global test configuration
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this);
  }
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
`;
  
  try {
    fs.writeFileSync(setupTestsPath, setupTestsContent);
    console.log('   ✅ Created: src/setupTests.js for Vitest');
  } catch (error) {
    console.log(`   ❌ Failed to create setupTests.js: ${error.message}`);
  }
}

// Check for any process.env.PUBLIC_URL usage in source files
console.log('\n🔍 Checking for process.env.PUBLIC_URL usage...');
function checkForPublicUrl(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      checkForPublicUrl(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('process.env.PUBLIC_URL')) {
          console.log(`   ⚠️  Found process.env.PUBLIC_URL in: ${filePath.replace(__dirname, '')}`);
          console.log('      💡 Consider replacing with import.meta.env.BASE_URL or removing if not needed');
        }
      } catch (error) {
        // Ignore read errors
      }
    }
  });
}

checkForPublicUrl(path.join(__dirname, 'src'));

console.log('\n✨ Migration tasks completed!');
console.log('\n📋 Next steps:');
console.log('   1. Run: npm run dev (to start Vite dev server)');
console.log('   2. Run: npm run docs:dev (to start VitePress documentation)');
console.log('   3. Test your application thoroughly');
console.log('   4. Update any remaining CRA-specific code');
console.log('   5. Update deployment scripts to use "npm run build" instead of CRA build');

console.log('\n🎉 Your app is now running on Vite!');
console.log('📚 Documentation is available at: http://localhost:5173/docs (when running docs:dev)');
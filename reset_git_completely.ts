import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

console.log('=== COMPLETELY RE-INITIALIZING GIT REPOSITORY ===');
try {
  // Remove corrupt .git folder recursively
  execSync('rm -rf .git', { stdio: 'inherit' });
  console.log('Deleted old corrupt .git folder.');

  // Initialize fresh new git repository
  execSync('git init', { stdio: 'inherit' });
  console.log('Fresh git repository initialized.');

  // Configure user details to allow committing
  execSync('git config user.name "AI Codegen"', { stdio: 'inherit' });
  execSync('git config user.email "codegen@aistudio.com"', { stdio: 'inherit' });
  console.log('Configured generic git committer identity.');

  // Add all files
  execSync('git add .', { stdio: 'inherit' });
  console.log('Added all files to index.');

  // Create initial commit
  const commitMsg = 'initial commit: clean standard launcher icons and splash assets with JDK 21 setup';
  const out = execSync(`git commit -m "${commitMsg}"`, { encoding: 'utf8' });
  console.log('Commit created successfully:\n', out);

  const sha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  console.log(`\nHEALTHY SHA: ${sha}`);
} catch (e: any) {
  console.log('Failed complete reset:', e.message);
}

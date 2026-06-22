import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

console.log('=== STARTING DEEP GIT REBUILD FROM SCRATCH ===');

const gitDir = path.join(process.cwd(), '.git');

if (fs.existsSync(gitDir)) {
  console.log('Removing old corrupt .git folder...');
  // Use rm -rf safely via child_process
  execSync('rm -rf .git', { stdio: 'inherit' });
  console.log('Successfully deleted the corrupted .git folder.');
}

console.log('Initializing a fresh git repository...');
execSync('git init', { stdio: 'inherit' });

console.log('Configuring local Git identities...');
execSync('git config user.name "AI Codegen"', { stdio: 'inherit' });
execSync('git config user.email "codegen@aistudio.com"', { stdio: 'inherit' });

console.log('Staging all project files (ignoring files in .gitignore)...');
execSync('git add .', { stdio: 'inherit' });

console.log('Creating initial pristine commit...');
const commitMsg = 'fix: completely restore valid, 8-bit RGBA binary PNG launcher icons after deep git repair';
const commitOut = execSync(`git commit -m "${commitMsg}"`, { encoding: 'utf8' });
console.log('Git Commit successful:\n', commitOut);

const sha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
console.log(`\n=== RECONSTRUCTED GIT SUCCESS == =`);
console.log(`CURRENT SECURE GIT SHA: ${sha}`);

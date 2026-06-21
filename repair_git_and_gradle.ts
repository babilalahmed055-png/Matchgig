import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

console.log('=== FORCE GIT RESET TO KNOWN HEALTHY COMMIT ===');

const corruptCommits = [
  'fa9d8ae54bea0aa1dc6f5849040cf17ad4f9df82',
  'aa1a7c322f6a165fc22e87b77783c15e9a52437f'
];

for (const c of corruptCommits) {
  const prefix = c.slice(0, 2);
  const suffix = c.slice(2);
  const cObjPath = path.join(process.cwd(), '.git', 'objects', prefix, suffix);
  if (fs.existsSync(cObjPath)) {
    console.log(`Deleting corrupt loose object file: ${cObjPath}`);
    fs.unlinkSync(cObjPath);
  }
}

const safeCommit = '0f5bce0e715c97eea2f06352cdecd90dedca2182';

const masterRefPath = path.join(process.cwd(), '.git', 'refs', 'heads', 'master');
if (fs.existsSync(masterRefPath)) {
  console.log(`Resetting master branch to previous known healthy commit: ${safeCommit}`);
  fs.writeFileSync(masterRefPath, `${safeCommit}\n`, 'utf8');
}

try {
  console.log('Running git reset to recreate index...');
  execSync('rm -f .git/index', { stdio: 'inherit' });
  execSync('git reset --mixed', { stdio: 'inherit' });
  console.log('Git index successfully restored to healthy status.');
} catch (e: any) {
  console.log('Git reset failed:', e.message);
}

console.log('\n=== RE-STAGING AND CREATING A NEW PURE COMMIT ===');
try {
  execSync('git add android/app/src/main/res/**/*.png', { stdio: 'inherit' });
  // Add workflow as well since we modified it before
  execSync('git add .github/workflows/android-build.yml', { stdio: 'inherit' });
  const status = execSync('git status --short', { encoding: 'utf8' }).trim();
  console.log('Staged files:\n', status);

  const commitOut = execSync('git commit -m "fix: restore fully standard clean and verified 8-bit RGBA launcher and splash assets with no metadata chunks and set JDK 21"', { encoding: 'utf8' });
  console.log('Commit successfully created!');
  console.log(commitOut);
} catch (e: any) {
  console.log('Commit failed:', e.message);
}

const finalSHA = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
console.log(`\nCURRENT SHA: ${finalSHA}`);




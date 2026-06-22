import { execSync } from 'child_process';
try {
  const diff = execSync('git diff --name-status', { encoding: 'utf8' });
  console.log('=== GIT DIFF ===');
  console.log(diff || '(no changes currently)');
} catch (e: any) {
  console.log('Error printing diff:', e.message);
}

try {
  const status = execSync('git status', { encoding: 'utf8' });
  console.log('=== GIT STATUS ===');
  console.log(status);
} catch (e: any) {
  console.log('Error printing status:', e.message);
}

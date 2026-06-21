import { execSync } from 'child_process';
try {
  const sha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  console.log('SHA:', sha);
} catch (e: any) {
  console.log('Error rev-parse HEAD:', e.message);
}

try {
  const status = execSync('git status --short', { encoding: 'utf8' }).trim();
  console.log('Status:\n', status);
} catch (e: any) {
  console.log('Error status:', e.message);
}

import { execSync } from 'child_process';
try {
  const status = execSync('git status', { encoding: 'utf8' });
  console.log('=== CURRENT STATUS ===');
  console.log(status);
} catch (e: any) {
  console.log('Status failed:', e.message);
}

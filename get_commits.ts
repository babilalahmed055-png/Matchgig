import { execSync } from 'child_process';
try {
  const log = execSync('git log --oneline -n 10', { encoding: 'utf8' });
  console.log('=== GIT LOG ===');
  console.log(log);
} catch (e: any) {
  console.log('Error printing git log:', e.message);
  console.log('stderr:', e.stderr || '');
}

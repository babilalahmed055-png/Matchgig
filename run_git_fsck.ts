import { execSync } from 'child_process';
try {
  const fsckOut = execSync('git fsck --full', { encoding: 'utf8' });
  console.log('=== GIT FSCK ===');
  console.log(fsckOut);
} catch (e: any) {
  console.log('Error running git fsck:', e.message);
  console.log('stdout:', e.stdout || '');
  console.log('stderr:', e.stderr || '');
}

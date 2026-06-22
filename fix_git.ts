import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const gitIndexPath = path.join(process.cwd(), '.git', 'index');
if (fs.existsSync(gitIndexPath)) {
  console.log('Deleting corrupted git index...');
  fs.unlinkSync(gitIndexPath);
}

try {
  console.log('Resetting git index...');
  execSync('git reset', { stdio: 'inherit' });
  console.log('Git status:');
  console.log(execSync('git status', { encoding: 'utf8' }));
} catch (e: any) {
  console.error('Error fixing git:', e.message);
}

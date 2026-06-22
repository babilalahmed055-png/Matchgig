import * as fs from 'fs';
import * as path from 'path';

console.log('=== CHECKING REFLOGS ===');
const headLogPath = path.join(process.cwd(), '.git', 'logs', 'HEAD');
const masterLogPath = path.join(process.cwd(), '.git', 'logs', 'refs', 'heads', 'master');

if (fs.existsSync(headLogPath)) {
  console.log('--- HEAD logs (last 5 lines) ---');
  const lines = fs.readFileSync(headLogPath, 'utf8').trim().split('\n');
  lines.slice(-5).forEach(l => console.log(l));
} else {
  console.log('No HEAD reflog found.');
}

if (fs.existsSync(masterLogPath)) {
  console.log('--- master logs (last 5 lines) ---');
  const lines = fs.readFileSync(masterLogPath, 'utf8').trim().split('\n');
  lines.slice(-5).forEach(l => console.log(l));
} else {
  console.log('No master reflog found.');
}

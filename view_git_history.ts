import * as fs from 'fs';
import * as path from 'path';

const logPath = path.join(process.cwd(), '.git', 'logs', 'refs', 'heads', 'master');
if (fs.existsSync(logPath)) {
  console.log(fs.readFileSync(logPath, 'utf8'));
} else {
  console.log('No master ref log found.');
}

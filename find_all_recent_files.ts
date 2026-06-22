import * as fs from 'fs';
import * as path from 'path';

function scan(dir: string, depth: number = 0) {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('android')) return;
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scan(full, depth + 1);
    } else {
      console.log(`File: ${path.relative(process.cwd(), full)} | Size: ${stat.size} bytes | Modified: ${stat.mtime}`);
    }
  }
}

console.log('--- ALL NON-ANDROID FILES ---');
scan(process.cwd());

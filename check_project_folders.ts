import * as fs from 'fs';
import * as path from 'path';

function countFiles(dir: string): number {
  let count = 0;
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (f === 'node_modules' || f === '.git') continue;
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        count += countFiles(full);
      } else {
        count++;
      }
    }
  } catch (e) {}
  return count;
}

const rootFiles = fs.readdirSync(process.cwd());
console.log('=== DIRECTORY SIZES (excl node_modules/git) ===');
for (const f of rootFiles) {
  if (f === 'node_modules' || f === '.git') continue;
  const full = path.join(process.cwd(), f);
  const stat = fs.statSync(full);
  if (stat.isDirectory()) {
    const count = countFiles(full);
    console.log(`  - ${f}/: ${count} files`);
  } else {
    console.log(`  - ${f} (file): ${stat.size} bytes`);
  }
}

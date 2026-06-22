import * as fs from 'fs';
import * as path from 'path';

function searchPngs(dir: string, results: string[] = []) {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('android/app/build') || dir.includes('android/build')) {
    return;
  }
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      searchPngs(full, results);
    } else if (f.endsWith('.png')) {
      if (!full.includes('android/app/src/main/res')) {
        results.push(full);
      }
    }
  }
  return results;
}

const pngFiles = searchPngs(process.cwd());
console.log('--- FOUND PNG FILES (excluding android res) ---');
console.log(pngFiles);

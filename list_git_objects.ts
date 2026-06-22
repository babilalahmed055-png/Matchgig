import * as fs from 'fs';
import * as path from 'path';

function findObjects(dir: string, results: string[] = []) {
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      findObjects(full, results);
    } else {
      results.push(full);
    }
  }
  return results;
}

const objectsDir = path.join(process.cwd(), '.git', 'objects');
const list = findObjects(objectsDir);
console.log(`=== FOUND INTERNAL GIT OBJECTS (${list.length}) ===`);
list.slice(0, 30).forEach(objPath => {
  const rel = path.relative(objectsDir, objPath);
  const stat = fs.statSync(objPath);
  console.log(`  - ${rel}: size=${stat.size} bytes`);
});
if (list.length > 30) {
  console.log('...and more objects');
}

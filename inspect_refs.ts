import * as fs from 'fs';
import * as path from 'path';

function printRefs(dir: string) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      printRefs(full);
    } else {
      console.log(`Ref file: ${path.relative(process.cwd(), full)} => ${fs.readFileSync(full, 'utf8').trim()}`);
    }
  }
}

const refsPath = path.join(process.cwd(), '.git', 'refs');
if (fs.existsSync(refsPath)) {
  printRefs(refsPath);
} else {
  console.log('No refs directory found!');
}

const headPath = path.join(process.cwd(), '.git', 'HEAD');
if (fs.existsSync(headPath)) {
  console.log('HEAD contains:', fs.readFileSync(headPath, 'utf8').trim());
}

import * as fs from 'fs';
import * as path from 'path';

function checkDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.png')) {
      const buf = fs.readFileSync(full);
      console.log(`File: ${path.relative(process.cwd(), full)}`);
      console.log(`  Size: ${buf.length} bytes`);
      console.log(`  Hex signature: ${buf.slice(0, 16).toString('hex').toUpperCase()}`);
    }
  }
}

const baseDir = '/app/applet/ios/App/App/Assets.xcassets';
if (fs.existsSync(baseDir)) {
  checkDir(baseDir);
} else {
  console.log('baseDir does not exist');
}


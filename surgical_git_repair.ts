import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

console.log('=== SURGICAL GIT REPAIR START ===');

const masterRefPath = path.join(process.cwd(), '.git', 'refs', 'heads', 'master');
const indexPath = path.join(process.cwd(), '.git', 'index');

// 1. Force master branch ref to point to the healthy commit: ca058b26d89877df2f1130a17911451535210f6c
if (fs.existsSync(masterRefPath)) {
  fs.writeFileSync(masterRefPath, 'ca058b26d89877df2f1130a17911451535210f6c\n', 'utf8');
  console.log('Successfully forced master ref to ca058b26d89877df2f1130a17911451535210f6c');
} else {
  console.log('master ref file did not exist at:', masterRefPath);
}

// 2. Delete corrupt loose object to prevent Git from reading it
const corruptPath = path.join(process.cwd(), '.git', 'objects', '82', 'd487449bc5951ac73ceb84f6849da990ae13cf');
if (fs.existsSync(corruptPath)) {
  fs.unlinkSync(corruptPath);
  console.log('Deleted corrupt loose object:', corruptPath);
}

// 3. Delete index
if (fs.existsSync(indexPath)) {
  fs.unlinkSync(indexPath);
  console.log('Deleted index file.');
}

// 4. Try resetting index
try {
  const resetOut = execSync('git reset --mixed HEAD', { encoding: 'utf8' });
  console.log('git reset output:\n', resetOut);
} catch (err: any) {
  console.log('git reset failed:', err.message);
}

// 5. Try getting short git status
try {
  const statusOut = execSync('git status --short', { encoding: 'utf8' });
  console.log('git status output:\n', statusOut);
} catch (err: any) {
  console.log('git status failed:', err.message);
}


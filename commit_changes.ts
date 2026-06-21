import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

function run(cmd: string) {
  console.log(`\n=== RUNNING: ${cmd} ===`);
  try {
    const out = execSync(cmd, { encoding: 'utf8' });
    console.log(out);
    return out;
  } catch (err: any) {
    console.log(`ERROR running command: ${err.message}`);
    if (err.stdout) console.log(`STDOUT:\n`, err.stdout);
    if (err.stderr) console.log(`STDERR:\n`, err.stderr);
    return null;
  }
}

// 1. Show diff to see what is changed
run('git diff android/app/src/main/res/mipmap-mdpi');

// 2. Stage everything (retains/stages deletes, adds untracked files)
run('git add -A');

// 3. Commit
run('git commit -m "fix: replace mipmap-mdpi launcher and foreground icons with programmatic solid color PNGs"');

// 4. Try pushing if remote exists
run('git push');

// 5. Show final git status to verify it is completely clean
run('git status');

// 6. Get the new HEAD commit SHA
run('git rev-parse HEAD');


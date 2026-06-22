import * as fs from 'fs';
import * as path from 'path';

const configPath = path.join(process.cwd(), '.git', 'config');
if (fs.existsSync(configPath)) {
  console.log('=== .git/config ===');
  console.log(fs.readFileSync(configPath, 'utf8'));
} else {
  console.log('.git/config does not exist');
}

import * as fs from 'fs';
import * as path from 'path';

const caObjectPath = path.join(process.cwd(), '.git', 'objects', 'ca', '058b26d89877df2f1130a17911451535210f6c');
console.log('ca object exists:', fs.existsSync(caObjectPath));
if (fs.existsSync(caObjectPath)) {
  console.log('size:', fs.statSync(caObjectPath).size, 'bytes');
}

// Let us find any directory in .git/objects/ca/
const caDir = path.join(process.cwd(), '.git', 'objects', 'ca');
if (fs.existsSync(caDir)) {
  console.log('Files inside .git/objects/ca/:\n', fs.readdirSync(caDir));
} else {
  console.log('.git/objects/ca/ directory does not exist');
}

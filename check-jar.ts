import fs from 'fs';
import path from 'path';

const jarPath = path.join(process.cwd(), 'android', 'gradle', 'wrapper', 'gradle-wrapper.jar');

if (!fs.existsSync(jarPath)) {
  console.log('JAR does not exist at', jarPath);
  process.exit(1);
}

const stats = fs.statSync(jarPath);
console.log('Size of gradle-wrapper.jar is:', stats.size, 'bytes');

const buffer = Buffer.alloc(4);
const fd = fs.openSync(jarPath, 'r');
fs.readSync(fd, buffer, 0, 4, 0);
fs.closeSync(fd);

const magicNum = buffer.toString('hex');
console.log('First 4 bytes (hex):', magicNum);
console.log('First 4 bytes (ASCII):', buffer.toString('ascii'));
console.log('Is ZIP magic (504b0304):', magicNum === '504b0304');

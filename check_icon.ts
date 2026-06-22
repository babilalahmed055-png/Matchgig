import * as fs from 'fs';
import { Jimp } from 'jimp';

async function main() {
  const file = 'assets/icon.png';
  if (!fs.existsSync(file)) {
    console.log('File does not exist');
    return;
  }
  const stat = fs.statSync(file);
  console.log('Size:', stat.size, 'bytes');
  try {
    const img = await Jimp.read(file);
    console.log('Dimensions:', img.width, 'x', img.height);
  } catch (err: any) {
    console.log('Jimp read error:', err.message);
  }
}
main();

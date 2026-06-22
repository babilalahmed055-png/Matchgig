import { Jimp } from 'jimp';
import * as fs from 'fs';

async function main() {
  const p = '/app/applet/ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png';
  if (!fs.existsSync(p)) {
    console.log('Source AppIcon-512@2x.png does not exist.');
    return;
  }
  try {
    const img = await Jimp.read(p);
    console.log(`Successfully loaded source image. Dims: ${img.width}x${img.height}`);
  } catch (err: any) {
    console.log('Failed to load image:', err.message);
  }
}
main();

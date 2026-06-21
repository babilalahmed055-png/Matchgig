import * as fs from 'fs';
import * as path from 'path';
import { Jimp } from 'jimp';

const mdpiDir = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'res', 'mipmap-mdpi');

async function main() {
  if (!fs.existsSync(mdpiDir)) {
    console.log('Error: mipmap-mdpi directory does not exist.');
    process.exit(1);
  }

  // Generate ic_launcher.png (48x48, solid color #a855f7)
  const img1 = new Jimp({ width: 48, height: 48, color: 0xa855f7ff });
  await img1.write(path.join(mdpiDir, 'ic_launcher.png'));
  console.log('Generated ic_launcher.png');

  // Generate ic_launcher_round.png (48x48, solid color #a855f7)
  const img2 = new Jimp({ width: 48, height: 48, color: 0xa855f7ff });
  await img2.write(path.join(mdpiDir, 'ic_launcher_round.png'));
  console.log('Generated ic_launcher_round.png');

  // Generate ic_launcher_foreground.png (108x108, solid color #c084fc)
  const img3 = new Jimp({ width: 108, height: 108, color: 0xc084fcff });
  await img3.write(path.join(mdpiDir, 'ic_launcher_foreground.png'));
  console.log('Generated ic_launcher_foreground.png');
}

main().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});

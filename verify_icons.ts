import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const files = [
  'android/app/src/main/res/mipmap-mdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png'
];

async function main() {
  console.log('=== VERIFYING IMAGES ===');
  for (const f of files) {
    const fullPath = path.join(process.cwd(), f);
    if (!fs.existsSync(fullPath)) {
      console.log(`ERROR: File not found: ${f}`);
      continue;
    }
    const buffer = fs.readFileSync(fullPath);
    const size = buffer.length;
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    
    // Check dimensions from PNG chunk headers manually:
    // PNG signature is 8 bytes, followed by IHDR chunk
    // IHDR length: 4 bytes (offset 8-11), chunk type: 4 bytes "IHDR" (offset 12-15),
    // width: 4 bytes BE (offset 16-19), height: 4 bytes BE (offset 20-23)
    let width = 0;
    let height = 0;
    if (buffer.length >= 24) {
      const signature = buffer.slice(0, 8).toString('hex');
      const isPng = signature === '89504e470d0a1a0a';
      const chunkType = buffer.slice(12, 16).toString('ascii');
      if (isPng && chunkType === 'IHDR') {
        width = buffer.readUInt32BE(16);
        height = buffer.readUInt32BE(20);
      }
    }
    
    console.log(`File: ${f}`);
    console.log(`  Size: ${size} bytes`);
    console.log(`  SHA256: ${sha256}`);
    console.log(`  Dimensions: ${width}x${height}`);
  }
}

main().catch(err => {
  console.error(err);
});

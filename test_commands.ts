import { execSync } from 'child_process';
try {
  const fileOut = execSync('file --version', { encoding: 'utf8' });
  console.log('file command exists:', fileOut.trim());
} catch (e: any) {
  console.log('file command missing or failed:', e.message);
}

try {
  const pngcheckOut = execSync('pngcheck --version', { encoding: 'utf8' });
  console.log('pngcheck command exists:', pngcheckOut.trim());
} catch (e: any) {
  console.log('pngcheck command missing or failed:', e.message);
}

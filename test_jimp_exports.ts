import { Jimp } from 'jimp';

async function test() {
  try {
    const imgObj = new Jimp({ width: 100, height: 100, color: 0xFF0000FF });
    console.log('Jimp object created successfully:', imgObj.width, 'x', imgObj.height);
    await imgObj.write('test.png');
    console.log('test.png written successfully!');
  } catch (err: any) {
    console.error('Error creating image:', err);
  }
}
test();

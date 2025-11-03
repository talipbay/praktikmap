const sharp = require('sharp');
const path = require('path');

async function changeBackground() {
  try {
    const inputPath = 'public/f.png';
    const outputPath = 'public/f_new_bg.png';
    
    // Read the original image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Processing image: ${metadata.width}x${metadata.height}`);
    
    // Create a white background
    const background = sharp({
      create: {
        width: metadata.width,
        height: metadata.height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    });
    
    // Composite the original image on top of the white background
    await background
      .composite([{ input: inputPath }])
      .png()
      .toFile(outputPath);
    
    console.log(`Background changed successfully! New file: ${outputPath}`);
    console.log('To use different background colors, modify the background object in the script.');
    
  } catch (error) {
    console.error('Error changing background:', error.message);
  }
}

changeBackground();
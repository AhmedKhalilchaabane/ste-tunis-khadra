const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PROJET_HAMA_DIR = './PROJET HAMA';
const SIZES = {
    small: 300,
    large: 800
};

async function optimizeImage(inputPath) {
    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const basename = path.basename(inputPath, ext);

    // Create small version
    await sharp(inputPath)
        .resize(SIZES.small)
        .jpeg({ quality: 80 })
        .toFile(path.join(dir, `${basename}-small${ext}`));

    // Optimize original for large size
    await sharp(inputPath)
        .resize(SIZES.large)
        .jpeg({ quality: 85 })
        .toFile(path.join(dir, `${basename}-optimized${ext}`));
}

async function processDirectory(directory) {
    try {
        const items = fs.readdirSync(directory);
        
        for (const item of items) {
            const fullPath = path.join(directory, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                await processDirectory(fullPath);
            } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
                console.log(`Optimizing: ${fullPath}`);
                await optimizeImage(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${directory}:`, error);
    }
}

// Start processing
console.log('Starting image optimization...');
processDirectory(PROJET_HAMA_DIR)
    .then(() => console.log('Image optimization complete!'))
    .catch(error => console.error('Error during optimization:', error));

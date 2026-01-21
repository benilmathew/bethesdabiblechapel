const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
    const inputDir = './assets/images/homepage';
    const outputDir = './assets/images/homepage/optimized';

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Optimizing carousel images...');

    // Get all JPG files
    const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.jpg'));

    for (const file of files) {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, file);
        const webpPath = path.join(outputDir, file.replace('.jpg', '.webp'));

        console.log(`Processing ${file}...`);

        // Get original file size
        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;

        // Optimize JPEG
        await sharp(inputPath)
            .jpeg({ quality: 80, progressive: true })
            .toFile(outputPath);

        // Convert to WebP
        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(webpPath);

        // Get new file sizes
        const optimizedStats = fs.statSync(outputPath);
        const webpStats = fs.statSync(webpPath);
        const optimizedSize = optimizedStats.size;
        const webpSize = webpStats.size;

        const jpegSavings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        const webpSavings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);

        console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`  Optimized JPEG: ${(optimizedSize / 1024 / 1024).toFixed(2)}MB (${jpegSavings}% smaller)`);
        console.log(`  WebP: ${(webpSize / 1024 / 1024).toFixed(2)}MB (${webpSavings}% smaller)`);
    }

    console.log('Image optimization complete!');
}

optimizeImages().catch(console.error);
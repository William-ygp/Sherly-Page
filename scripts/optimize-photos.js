import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = path.resolve('photos-src');
const outputDir = path.resolve('public/photos');

async function optimizePhotos() {
  if (!fs.existsSync(inputDir)) {
    console.log(`📁 Creando carpeta origen: ${inputDir}`);
    fs.mkdirSync(inputDir, { recursive: true });
    console.log(`⚠️  Coloca tus fotos originales (JPG, PNG) en 'photos-src/' y vuelve a ejecutar 'npm run optimize:photos'.`);
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir).filter((file) => {
    return /\.(jpe?g|png|webp|tiff|avif)$/i.test(file);
  });

  if (files.length === 0) {
    console.log(`ℹ️  No se encontraron imágenes en '${inputDir}'.`);
    console.log(`   Coloca tus fotos originales allí para optimizarlas.`);
    return;
  }

  console.log(`✨ Optimizando ${files.length} foto(s) a WebP...`);

  for (const file of files) {
    const inputFilePath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const fullOutputPath = path.join(outputDir, `${baseName}.webp`);
    const thumbOutputPath = path.join(outputDir, `${baseName}-thumb.webp`);

    try {
      // 1. Imagen principal: máximo 1600px de ancho
      await sharp(inputFilePath)
        .rotate() // Respeta orientación EXIF
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(fullOutputPath);

      // 2. Miniatura: máximo 600px de ancho
      await sharp(inputFilePath)
        .rotate()
        .resize({ width: 600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(thumbOutputPath);

      console.log(`  ✓ ${file} -> ${baseName}.webp & ${baseName}-thumb.webp`);
    } catch (err) {
      console.error(`  ✗ Error al procesar ${file}:`, err);
    }
  }

  console.log(`\n🎉 Fotos optimizadas con éxito en 'public/photos/'.`);
}

optimizePhotos();


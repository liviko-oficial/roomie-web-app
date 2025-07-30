import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

const app = express()
const PORT = 3000


app.use(express.static('.'));
app.get('/', (req,res) => {
res.sendFile(path.resolve('../../Main.html'));
})

//Multer para la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024,
        files: 7
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname){
            return cb(null,true);
        }
        else{
            cb(new Error('Solo se permiten imágenes'));
        }
    }
});

//Endpoint principal
app.post('/process-images', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'optionalImages', maxCount: 6 }
]), async (req, res) => {
  try {
    // Validar que existe la imagen principal
    if (!req.files || !req.files.mainImage || req.files.mainImage.length === 0) {
      return res.status(400).json({ 
        error: 'La imagen principal es obligatoria',
        required: 'mainImage'
      });
    }

    const mainImage = req.files.mainImage[0];
    const optionalImages = req.files.optionalImages || [];
    
    console.log(`Procesando: 1 imagen principal + ${optionalImages.length} imágenes opcionales`);

    // Procesar todas las imágenes
    const results = await processAllImages(mainImage, optionalImages);
    
    res.json({
      success: true,
      processed: {
        mainImage: results.mainImage,
        optionalImages: results.optionalImages,
        totalProcessed: 1 + optionalImages.length
      }
    });

  } catch (error) {
    console.error('Error procesando imágenes:', error);
    res.status(500).json({ 
      error: 'Error procesando las imágenes',
      details: error.message 
    });
  }
});

async function processAllImages(mainImage, optionalImages = []) {
  try {
    // Procesar imagen principal
    console.log('Procesando imagen principal...');
    const processedMainImage = await enhanceImage(mainImage.buffer, 'main');
    
    // Procesar imágenes opcionales en paralelo
    console.log(`Procesando ${optionalImages.length} imágenes opcionales...`);
    const processedOptionalImages = await Promise.all(
      optionalImages.map(async (img, index) => {
        try {
          const processed = await enhanceImage(img.buffer, `optional_${index + 1}`);
          return {
            index: index + 1,
            originalName: img.originalname,
            size: processed.length,
            success: true
          };
        } catch (error) {
          console.error(`Error procesando imagen opcional ${index + 1}:`, error);
          return {
            index: index + 1,
            originalName: img.originalname,
            success: false,
            error: error.message
          };
        }
      })
    );

    return {
      mainImage: {
        originalName: mainImage.originalname,
        size: processedMainImage.length,
        success: true
      },
      optionalImages: processedOptionalImages
    };

  } catch (error) {
    throw new Error(`Error en processAllImages: ${error.message}`);
  }
}


async function enhanceImage(buffer, imageType = 'unknown') {
  try {
    const metadata = await sharp(buffer).metadata();
    console.log(`Procesando ${imageType}: ${metadata.width}x${metadata.height}, ${metadata.format}`);
    
    // Configuración diferente según el tipo de imagen
    let enhanceConfig = getEnhanceConfig(imageType, metadata);
    
    const enhanced = await sharp(buffer)
      // Redimensionar si es necesario
      .resize(enhanceConfig.resize)
      // Aplicar mejoras
      .sharpen(enhanceConfig.sharpen)
      .normalize(enhanceConfig.normalize)
      // Formato de salida
      .jpeg({
        quality: enhanceConfig.quality,
        progressive: true
      })
      .toBuffer();
      
    return enhanced;
    
  } catch (error) {
    throw new Error(`Error mejorando imagen ${imageType}: ${error.message}`);
  }
}

function getEnhanceConfig(imageType, metadata) {
  const baseConfig = {
    resize: null,
    sharpen: { sigma: 1.0, flat: 1.0, jagged: 2.0 },
    normalize: true,
    quality: 90
  };

  // Configuración especial para imagen principal
  if (imageType === 'main') {
    baseConfig.quality = 95;
    baseConfig.sharpen = { sigma: 1.2, flat: 1.0, jagged: 2.5 };
    
    // Si es muy pequeña, hacer upscale
    if (metadata.width < 1000 || metadata.height < 750) {
      baseConfig.resize = {
        width: Math.round(metadata.width * 1.5),
        height: Math.round(metadata.height * 1.5),
        kernel: sharp.kernel.lanczos3
      };
    }
  }
  
  // Para imágenes opcionales, menos agresivo
  if (imageType.startsWith('optional')) {
    baseConfig.quality = 85;
    baseConfig.sharpen = { sigma: 0.8, flat: 1.0, jagged: 1.5 };
  }

  return baseConfig;
}

// Almacenar temporalmente las imágenes procesadas
const processedImages = new Map();

app.post('/process-and-store', upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'optionalImages', maxCount: 6 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ error: 'Imagen principal requerida' });
    }

    const sessionId = Date.now().toString();
    const mainImage = req.files.mainImage[0];
    const optionalImages = req.files.optionalImages || [];

    // Procesar y almacenar
    const processedMain = await enhanceImage(mainImage.buffer, 'main');
    const processedOptional = await Promise.all(
      optionalImages.map(img => enhanceImage(img.buffer, 'optional'))
    );

    // Guardar en memoria temporal 
    processedImages.set(sessionId, {
      mainImage: processedMain,
      optionalImages: processedOptional,
      timestamp: Date.now()
    });

    // Limpiar después de 1 hora
    setTimeout(() => {
      processedImages.delete(sessionId);
    }, 3600000);

    res.json({
      success: true,
      sessionId: sessionId,
      downloadUrls: {
        mainImage: `/download/${sessionId}/main`,
        optionalImages: processedOptional.map((_, index) => 
          `/download/${sessionId}/optional/${index}`
        )
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`API de procesamiento de imágenes corriendo en puerto ${PORT}`);
  console.log(`Acepta: 1 imagen principal (obligatoria) + hasta 6 imágenes opcionales`);
});
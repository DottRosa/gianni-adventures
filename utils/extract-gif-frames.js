const fs = require("fs-extra");
const path = require("path");
const { GifReader } = require("omggif");
const sharp = require("sharp");

// Cartella contenente le GIF
const inputFolder = "./assets/gifs";
const outputFolder = "./assets/animations";

// Limite massimo di fotogrammi
const MAX_FRAMES = 20;

// Funzione per estrarre i fotogrammi di una GIF
async function extractFrames(gifPath, outputDir) {
  const gifBuffer = await fs.readFile(gifPath);
  const reader = new GifReader(gifBuffer);

  const width = reader.width;
  const height = reader.height;
  const numFrames = reader.numFrames();

  if (numFrames > MAX_FRAMES) {
    console.error(
      `Errore: ${path.basename(
        gifPath
      )} ha ${numFrames} fotogrammi. Limite massimo: ${MAX_FRAMES}.`
    );
    return;
  }

  console.log(
    `Elaborando: ${path.basename(gifPath)} (${numFrames} fotogrammi)`
  );

  // Creazione della directory di output
  await fs.ensureDir(outputDir);

  for (let i = 0; i < numFrames; i++) {
    // Decodifica il fotogramma in un buffer RGBA
    const frameBuffer = Buffer.alloc(width * height * 4);
    reader.decodeAndBlitFrameRGBA(i, frameBuffer);

    // Converte il buffer in un'immagine e la salva
    const framePath = path.join(outputDir, `${i}.gif`);
    await sharp(frameBuffer, { raw: { width, height, channels: 4 } })
      .toFormat("gif")
      .toFile(framePath);

    console.log(`  Salvato: ${framePath}`);
  }
}

// Funzione principale
async function processAllGifs() {
  try {
    // Resetta la cartella di output
    await fs.remove(outputFolder);
    await fs.ensureDir(outputFolder);

    // Controlla che la cartella di input esista
    if (!fs.existsSync(inputFolder)) {
      throw new Error(`La cartella "${inputFolder}" non esiste.`);
    }

    // Legge tutti i file GIF nella cartella
    const files = await fs.readdir(inputFolder);
    const gifFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".gif"
    );

    if (gifFiles.length === 0) {
      console.log("Nessuna GIF trovata nella cartella.");
      return;
    }

    // Processa ogni GIF
    for (const gifFile of gifFiles) {
      const gifPath = path.join(inputFolder, gifFile);
      const gifName = path.basename(gifFile, ".gif");
      const gifOutputDir = path.join(outputFolder, gifName);

      await extractFrames(gifPath, gifOutputDir);
    }

    console.log("Elaborazione completata!");
  } catch (error) {
    console.error("Errore:", error.message);
  }
}

// Esegui lo script
processAllGifs();

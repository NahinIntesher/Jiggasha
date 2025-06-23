// Compression functions for different file types
export async function compressImage(file) {
  try {
    const compressedBuffer = await sharp(file.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    return compressedBuffer;
  } catch (error) {
    console.error("Image compression failed:", error);
    return file.buffer; // Return original if compression fails
  }
}

export async function compressPDF(file) {
  try {
    // Create temp file
    const tempPath = path.join(__dirname, "temp", file.originalname);
    await writeFile(tempPath, file.buffer);

    // This is a simplified approach - consider using ghostscript for better compression
    const pdfDoc = await PDFDocument.load(file.buffer);
    const compressedBytes = await pdfDoc.save({ useObjectStreams: true });

    // Clean up
    await unlink(tempPath);
    return Buffer.from(compressedBytes);
  } catch (error) {
    console.error("PDF compression failed:", error);
    return file.buffer; // Return original if compression fails
  }
}

export async function compressAudio(file) {
  try {
    const tempInput = path.join(__dirname, "temp", file.originalname);
    const tempOutput = path.join(
      __dirname,
      "temp",
      `compressed_${file.originalname}`
    );

    await writeFile(tempInput, file.buffer);

    await new Promise((resolve, reject) => {
      ffmpeg(tempInput)
        .audioBitrate("128k")
        .audioCodec("libmp3lame")
        .on("error", reject)
        .on("end", resolve)
        .save(tempOutput);
    });

    const compressedBuffer = await fs.promises.readFile(tempOutput);

    // Clean up
    await unlink(tempInput);
    await unlink(tempOutput);

    return compressedBuffer;
  } catch (error) {
    console.error("Audio compression failed:", error);
    return file.buffer;
  }
}

export async function compressVideo(file) {
  try {
    const tempInput = path.join(__dirname, "temp", file.originalname);
    const tempOutput = path.join(
      __dirname,
      "temp",
      `compressed_${file.originalname}`
    );

    await writeFile(tempInput, file.buffer);

    await new Promise((resolve, reject) => {
      ffmpeg(tempInput)
        .videoCodec("libx264")
        .audioCodec("aac")
        .outputOptions(["-crf 28", "-preset fast", "-movflags faststart"])
        .on("error", reject)
        .on("end", resolve)
        .save(tempOutput);
    });

    const compressedBuffer = await fs.promises.readFile(tempOutput);

    // Clean up
    await unlink(tempInput);
    await unlink(tempOutput);

    return compressedBuffer;
  } catch (error) {
    console.error("Video compression failed:", error);
    return file.buffer;
  }
}

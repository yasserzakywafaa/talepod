/**
 * Image downscaling/recompression backed by sharp, loaded LAZILY so a missing
 * native binary can never crash module load / server boot — it just degrades to
 * a no-op (the caller keeps the original bytes). Used to keep generated story
 * art (and the exported eBook PDF) small and smooth.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sharpModule: any;
let sharpUnavailable = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSharp = (): any | null => {
  if (sharpModule) return sharpModule;
  if (sharpUnavailable) return null;
  try {
    // Lazy require (CommonJS) so the native addon only loads on first use.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    sharpModule = require("sharp");
    return sharpModule;
  } catch (error) {
    sharpUnavailable = true;
    console.error(
      "⚠️ sharp is unavailable — images will be stored/embedded unoptimized.",
      error,
    );
    return null;
  }
};

/**
 * Resize (fit inside maxDimension, never upscale) + recompress to JPEG.
 * Returns the optimized Buffer, or null when sharp is unavailable / fails so
 * the caller can fall back to the original bytes.
 */
export const optimizeToJpeg = async (
  input: Buffer,
  maxDimension: number,
  quality = 82,
): Promise<Buffer | null> => {
  const sharp = getSharp();
  if (!sharp) return null;
  try {
    return await sharp(input)
      .rotate()
      .resize({
        width: maxDimension,
        height: maxDimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  } catch (error) {
    console.error("⚠️ Image optimization failed; using original bytes", error);
    return null;
  }
};

/**
 * One-off helper: render the SAME sample scene in every art style so the create
 * form's Art Style picker can show a true preview of each look (instead of a
 * flat gradient). Writes optimized JPEGs to the client assets folder:
 *
 *   web/src/assets/images/art-styles/{styleId}.jpg
 *
 * Run from the `server` directory with an OpenRouter key available, e.g.:
 *   npx ts-node src/scripts/generateArtStyleSamples.ts
 *
 * It reuses the real generation path (`generateImageUrl`) + the same image
 * optimizer used for story art, so previews match what users actually get.
 */
import * as fs from "fs";
import * as path from "path";

import { ART_STYLES } from "../services/create/imageStyles";
import { generateImageUrl } from "../services/create/images";
import { optimizeToJpeg } from "../utils/imageOptimize";

// A single fixed, neutral bedtime scene — only the *style* clause changes per
// run, so the three thumbnails differ purely in art direction.
const SCENE =
  "A cheerful young child reading a storybook under a big leafy tree at golden hour, a friendly little fox sitting beside them, cozy calm bedtime mood, soft warm lighting, centered composition.";

const OUTPUT_DIR = path.resolve(
  __dirname,
  "../../../web/src/assets/images/art-styles",
);

/** Download the model's image URL (data: or remote) into a Buffer. */
const downloadImage = async (url: string): Promise<Buffer> => {
  if (url.startsWith("data:")) {
    const match = url.match(/^data:[^;]+;base64,(.+)$/);
    if (!match) throw new Error("Unsupported image data URL");
    return Buffer.from(match[1], "base64");
  }
  const fetched = await (globalThis as { fetch: typeof fetch }).fetch(url);
  if (!fetched.ok) {
    throw new Error(`Image download failed with status ${fetched.status}`);
  }
  return Buffer.from(await fetched.arrayBuffer());
};

const run = async () => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const style of Object.values(ART_STYLES)) {
    try {
      console.log(`🎨 Generating sample for "${style.id}" (${style.label})…`);
      const prompt = `${SCENE}${style.base}`;
      const url = await generateImageUrl(prompt, { aspectRatio: "4:3" });
      const raw = await downloadImage(url);
      const optimized = (await optimizeToJpeg(raw, 640)) ?? raw;
      const filePath = path.join(OUTPUT_DIR, `${style.id}.jpg`);
      fs.writeFileSync(filePath, optimized);
      console.log(`✅ Wrote ${filePath} (${optimized.length} bytes)`);
    } catch (error) {
      console.error(`❌ Failed sample for "${style.id}"`, error);
    }
  }
};

run()
  .then(() => {
    console.log("🏁 Done generating art-style samples.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Art-style sample generation crashed", error);
    process.exit(1);
  });

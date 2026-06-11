import { ComicPage, LongStoryImage, Story } from "../../models/types";
import { DBCollectionsEnum, getDocumentFromDb } from "../../models/mongoDb";

import CONFIG from "../../config";
import { ObjectId } from "mongodb";
import fs from "fs";
import { optimizeToJpeg } from "../../utils/imageOptimize";
import { updateDocument } from "../../models/mongoDb/crudOperations";
import { uploadFileToS3 } from "../amazonS3";
import { handleOpenRouterAIRequest } from "../../utils/openRouterClient";
import {
  DEFAULT_STYLE_SUFFIXES,
  getStyleSuffixes,
  resolveArtStyle,
} from "./imageStyles";

/** Hard rule appended to every image prompt — non-English titles often leak into art. */
const NO_TEXT_IN_ART_RULE = `

CRITICAL — ABSOLUTELY NO TEXT IN THE IMAGE (any language or script):
- Pure illustration only. Zero readable text anywhere in the artwork.
- Forbidden in ALL languages and scripts: English, Arabic, Portuguese, Chinese, Cyrillic, Hindi, Japanese, etc.
- Do NOT render story titles, book titles, author names, captions, labels, signs, logos, watermarks, letters, numbers, speech bubbles, or decorative typography.
- Any title or prose in this prompt is context for you only — never paint, emboss, carve, or overlay it on the image.
- No readable book-cover typography; the app displays all text separately from the art.`;

const sanitizeFileName = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "story";

type OpenRouterImageResponse = {
  choices?: Array<{
    message?: {
      images?: Array<{
        image_url?: {
          url?: string;
        };
      }>;
    };
  }>;
};

type ImageBytes = {
  bytes: Uint8Array;
  contentType: string;
  extension: string;
};

const getImageExtension = (contentType: string): string => {
  const normalized = contentType.split(";")[0].trim().toLowerCase();
  if (normalized === "image/jpeg") return "jpg";
  if (normalized === "image/webp") return "webp";
  if (normalized === "image/gif") return "gif";
  return "png";
};

const readDataUrlImage = (dataUrl: string): ImageBytes => {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("OpenRouter returned an unsupported image data URL.");
  }

  const contentType = match[1];
  return {
    bytes: new Uint8Array(Buffer.from(match[2], "base64")),
    contentType,
    extension: getImageExtension(contentType),
  };
};

const readRemoteImage = async (url: string): Promise<ImageBytes> => {
  const fetched = await (globalThis as { fetch: typeof fetch }).fetch(url);
  if (!fetched.ok) {
    throw new Error(`Image download failed with status ${fetched.status}`);
  }

  const contentType = fetched.headers.get("content-type") || "image/png";
  return {
    bytes: new Uint8Array(await fetched.arrayBuffer()),
    contentType,
    extension: getImageExtension(contentType),
  };
};

const readGeneratedImage = async (url: string): Promise<ImageBytes> => {
  if (url.startsWith("data:")) {
    return readDataUrlImage(url);
  }

  return readRemoteImage(url);
};

/**
 * Downscale + recompress a generated image to a web/print-friendly JPEG before
 * we host it. Models can return very large PNGs (multi-MB), which make the
 * reader janky and balloon the exported eBook PDF; a capped-width JPEG keeps
 * both snappy. Best-effort: returns the original bytes if sharp is unavailable.
 */
const optimizeImage = async (image: ImageBytes): Promise<ImageBytes> => {
  const optimized = await optimizeToJpeg(Buffer.from(image.bytes), 1280);
  if (!optimized) return image;
  return {
    bytes: new Uint8Array(optimized),
    contentType: "image/jpeg",
    extension: "jpg",
  };
};

export const generateImageUrl = async (
  prompt: string,
  options: {
    aspectRatio?: string;
    model?: string;
    referenceImageUrls?: string[];
  } = {},
): Promise<string> => {
  const { aspectRatio = "1:1", model, referenceImageUrls } = options;
  const openRouterApiKey = CONFIG.OPENROUTER_API_KEY;
  if (!openRouterApiKey) {
    throw new Error("OpenRouter API key is required for image generation.");
  }

  // With reference images, send a multimodal message (text + image parts) so a
  // reference-capable model keeps the same character across scenes; otherwise a
  // plain text prompt (txt2img) as before.
  const content =
    referenceImageUrls && referenceImageUrls.length
      ? [
          { type: "text", text: prompt },
          ...referenceImageUrls.map((url) => ({
            type: "image_url",
            image_url: { url },
          })),
        ]
      : prompt;

  const response = await (globalThis as { fetch: typeof fetch }).fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": CONFIG.APP_URL || "https://www.talepod.com",
        "X-Title": "Talepod",
      },
      body: JSON.stringify({
        model: model || CONFIG.OPENROUTER_IMAGES_MODEL,
        messages: [{ role: "user", content }],
        modalities: ["image"],
        image_config: {
          aspect_ratio: aspectRatio,
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `OpenRouter image generation failed (${response.status}): ${errorText.slice(
        0,
        500,
      )}`,
    );
  }

  const result = (await response.json()) as OpenRouterImageResponse;
  const imageUrl =
    result.choices?.[0]?.message?.images?.[0]?.image_url?.url;

  if (!imageUrl) {
    throw new Error("OpenRouter image response did not include an image URL.");
  }

  return imageUrl;
};

/**
 * Generate one image from a prompt and persist it to S3, returning the public
 * URL (or null on any failure). Recraft's returned URLs are ephemeral, so we
 * download the bytes immediately and re-host them on our own S3 bucket — the
 * same pattern used for generated audio.
 */
export const generateImage = async (
  prompt: string,
  fileBaseName: string,
  options: {
    styleSuffix?: string;
    aspectRatio?: string;
    model?: string;
    referenceImageUrls?: string[];
  } = {},
): Promise<string | null> => {
  try {
    const sourceUrl = await generateImageUrl(
      `${prompt}${options.styleSuffix ?? DEFAULT_STYLE_SUFFIXES.cover}`,
      {
        aspectRatio: options.aspectRatio,
        model: options.model,
        referenceImageUrls: options.referenceImageUrls,
      },
    );
    const rawImage = await readGeneratedImage(sourceUrl);
    const generatedImage = await optimizeImage(rawImage);

    const dir = CONFIG.SERVER_IMAGES_ABSOLUTE_PATH;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const fileName = `${fileBaseName}-${Date.now()}.${generatedImage.extension}`;
    const filePath = `${dir}/${fileName}`;
    await fs.promises.writeFile(filePath, generatedImage.bytes);

    const s3Url = await uploadFileToS3(fileName, filePath, {
      contentType: generatedImage.contentType,
      keyPrefix: CONFIG.SERVER_IMAGES_PATH,
    });

    // Best-effort temp cleanup.
    fs.promises.unlink(filePath).catch(() => undefined);

    return s3Url;
  } catch (error) {
    console.error("❌ Failed to generate/persist an image", { error });
    return null;
  }
};

type StoryWithProfile = Story & {
  profileInfo?: {
    name?: string;
    age?: number;
    gender?: string;
    interests?: string;
  };
};

/** Deterministic fallback descriptor built from the stored profile, used when
 *  the text model is unavailable so image generation never blocks. */
const fallbackCharacterSheet = (story: StoryWithProfile): string => {
  const name = story.profileInfo?.name || "the main character";
  const age = story.profileInfo?.age;
  const gender = story.profileInfo?.gender;
  return `${name}${age ? `, a ${age}-year-old` : ""}${
    gender ? ` ${String(gender).toLowerCase()}` : ""
  }. Keep the exact same face, hairstyle, hair color, skin tone, clothing and colors in every scene.`;
};

/**
 * Canonical visual character description — generated once via the text model,
 * cached on the story doc, and reused for the cover + every comic page so the
 * hero stays on-model across independent image generations (text-to-image calls
 * share no pixels, so a fixed written description is what keeps them aligned).
 * Best-effort: returns a profile-based fallback on any failure and never throws.
 */
const ensureCharacterSheet = async (
  story: StoryWithProfile,
  storyId: string,
): Promise<string> => {
  if (story.characterSheet && story.characterSheet.trim()) {
    return story.characterSheet.trim();
  }

  const name = story.profileInfo?.name || "the main character";
  const age = story.profileInfo?.age;
  const gender = story.profileInfo?.gender;
  const interests = story.profileInfo?.interests;

  try {
    const response = await handleOpenRouterAIRequest(
      CONFIG.OPENROUTER_DEFAULT_MODEL_NAME,
      [
        {
          role: "system",
          content:
            "You are a character designer for a children's picture book. " +
            "Reply with ONLY a compact visual description (2-4 sentences, under 90 words) of the " +
            "main character's fixed appearance, so an illustrator can draw them identically on " +
            "every page. Visual details only: skin tone, eye color and shape, hair color, length " +
            "and style, exact clothing and its colors, body proportions appropriate for the age, " +
            "and one distinguishing feature. If the story clearly has a recurring animal or " +
            "companion character, add one short clause describing it too. Respect the given name, " +
            "age and gender exactly. No personality, no plot, no preamble, no markdown, no lists.",
        },
        {
          role: "user",
          content:
            `Name: ${name}\n` +
            `Age: ${age ?? "young child"}\n` +
            `Gender: ${gender ?? "unspecified"}\n` +
            (interests ? `Interests: ${interests}\n` : "") +
            `Story title: ${story.title}\n` +
            `Story summary: ${story.summary || story.title}`,
        },
      ],
      // gpt-5-mini is a reasoning model — give it enough budget that the
      // visible answer survives after reasoning tokens (220 returned null).
      { max_tokens: 2000 },
    );

    const sheet = (response?.choices?.[0]?.message?.content || "").trim();
    if (sheet) {
      // Cache so re-runs / regeneration reuse the same locked description.
      await updateDocument(
        storyId,
        { characterSheet: sheet },
        DBCollectionsEnum.stories,
      ).catch(() => undefined);
      return sheet;
    }
  } catch (error) {
    console.error("⚠️ Character sheet generation failed; using fallback", {
      storyId,
      error,
    });
  }

  return fallbackCharacterSheet(story);
};

const buildCoverPrompt = (
  story: StoryWithProfile,
  characterSheet: string,
  medium: string,
): string => {
  const name = story.profileInfo?.name || "a child";
  const age = story.profileInfo?.age;
  const gender = story.profileInfo?.gender;
  const summary = story.summary || story.title || "a gentle bedtime story";
  return `Wide landscape ${medium} book cover art for a children's bedtime story.

Visual theme (context only — do NOT render any of this as visible text):
${summary}

Composition: horizontal 16:9 landscape orientation, cinematic wide cover art in a ${medium} style that fills the frame edge to edge. Place the main character prominently in the scene with rich environmental detail. Single cohesive cover scene — not a collage, not multiple panels. Illustration only — no book title, no typography, no lettering in any language.

Main character (draw exactly as described, keep on-model): ${characterSheet}

The hero is ${name}${age ? `, age ${age}` : ""}${
    gender ? `, ${gender}` : ""
  }. Keep the hero's gender and appearance visually consistent with the description above.${NO_TEXT_IN_ART_RULE}`;
};

/** Split prose into non-empty paragraphs for segment-based illustration prompts. */
const splitStoryParagraphs = (mainStory: string): string[] =>
  mainStory
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

/**
 * Pick two story segments (~1/3 and ~2/3 through the narrative) and turn them
 * into compact visual scene descriptions for interior illustrations.
 */
const deriveLongStoryImagePrompts = (
  story: StoryWithProfile,
  count = 2,
): LongStoryImage[] => {
  const paragraphs = splitStoryParagraphs(story.mainStory || "");
  const fallbackScene = story.summary || story.title || "a gentle bedtime moment";

  const pickParagraph = (ratio: number): string => {
    if (!paragraphs.length) return fallbackScene;
    const idx = Math.min(
      paragraphs.length - 1,
      Math.max(0, Math.floor(paragraphs.length * ratio)),
    );
    return paragraphs[idx];
  };

  const segments =
    paragraphs.length >= 2
      ? [pickParagraph(0.33), pickParagraph(0.66)]
      : [pickParagraph(0), fallbackScene];

  return segments.slice(0, count).map((segment, index) => ({
    index,
    imagePrompt: segment.slice(0, 500),
  }));
};

const buildLongInteriorPrompt = (
  story: StoryWithProfile,
  slot: LongStoryImage,
  characterSheet: string,
  medium: string,
  useReference = false,
): string => {
  const referenceGuide = useReference
    ? "\n\nA reference image of the main character is attached. The character you draw MUST be the exact same character as in the reference image — identical face, hairstyle, hair color, skin tone, and outfit. Only the scene, pose, camera angle, and action change. Match the reference's art style as well."
    : "";

  return `Create one full-bleed ${medium} children's storybook scene for an interior moment.

Story mood (context only — do NOT render as visible text):
${story.summary || "a gentle bedtime adventure"}

Character consistency guide (CRITICAL — keep identical in every scene):
${characterSheet}
Use this exact character design: same face, hairstyle, hair color, skin tone, clothing and colors, body proportions, age, and gender.${referenceGuide}

Scene to illustrate (visual action only — do not write this text in the image):
${slot.imagePrompt}

Composition requirements:
- One complete scene only, not a collage or multi-panel page.
- Full-bleed illustration. No border, frame, or caption box.
- Completely TEXT-FREE in every language — no letters, words, numbers, captions, titles, signs, or speech bubbles.
- Tell the story through expressions, body language, and action.${NO_TEXT_IN_ART_RULE}`;
};

const buildComicPagePrompt = (
  story: StoryWithProfile,
  page: ComicPage,
  pageIndex: number,
  totalPages: number,
  characterSheet: string,
  medium: string,
  useReference = false,
): string => {
  const scene = page.imagePrompt || page.caption;
  const referenceGuide = useReference
    ? "\n\nA reference image of the main character is attached. The character you draw MUST be the exact same character as in the reference image — identical face, hairstyle, hair color, skin tone, and outfit. Only the scene, pose, camera angle, and action change. Match the reference's art style as well."
    : "";

  return `Create one full-bleed ${medium} children's comic scene (scene ${
    pageIndex + 1
  } of ${totalPages}).

Story mood (context only — do NOT render as visible text):
${story.summary || "a gentle bedtime adventure"}

Character consistency guide (CRITICAL — keep identical in every scene):
${characterSheet}
Use this exact character design in every scene: same face, hairstyle, hair color, skin tone, clothing and colors, body proportions, age, and gender. Do not re-imagine or restyle the character, and never depict the main character as a different gender. Treat this as one continuous animated picture book with one locked character model.${referenceGuide}

Scene to illustrate (visual action only — do not write this text in the image):
${scene}

Composition requirements:
- One complete scene only, not a collage, not a multi-panel page, not a poster.
- Use the exact same 4:3 landscape canvas for every scene.
- Full-bleed illustration from edge to edge. No internal frame, no border, no matte, no white margin, no cream outer background, and no paper page surrounding the art.
- CRITICAL: render the scene completely TEXT-FREE in every language — no letters, words, numbers, captions, titles, page numbers, watermarks, labels, signs, speech bubbles, or caption boxes anywhere in the image. The story text is shown to the reader separately beneath the picture.
- Keep the same ${medium} art style, color palette, warm cinematic lighting, camera distance, and rendering quality across all scenes.
- Tell the story through the characters' expressions, body language, and action so the scene reads clearly on its own without any words.
- Use the same ${medium} storybook look as a single continuous picture book.${NO_TEXT_IN_ART_RULE}`;
};

/** Run an async mapper over items with a max number of in-flight tasks. */
const mapWithConcurrency = async <T>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<void>,
): Promise<void> => {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }).map(
    async () => {
      while (cursor < items.length) {
        const index = cursor++;
        await fn(items[index], index);
      }
    },
  );
  await Promise.all(workers);
};

/**
 * Background image generation for a freshly-created story. Best-effort: never
 * throws, persists partial results incrementally (so the reader's poll can show
 * progress), and finishes by setting `imagesStatus` to "ready" or "failed".
 */
export const handleGenerateStoryImages = async (
  storyId: string,
): Promise<void> => {
  try {
    const story = (await getDocumentFromDb(
      new ObjectId(storyId),
      DBCollectionsEnum.stories,
    )) as StoryWithProfile | null;
    if (!story) return;

    const slugBase = sanitizeFileName(story.slug || story.title || storyId);
    const characterSheet = await ensureCharacterSheet(story, storyId);

    // Resolve the user-chosen art style (defaults to oil2d) → drives both the
    // per-format style suffix and the "medium" wording inside each prompt.
    const artStyle = resolveArtStyle(story.artStyle);
    const styleSuffixes = getStyleSuffixes(artStyle);
    const { medium } = artStyle;

    if (
      story.format === "comic" &&
      Array.isArray(story.pages) &&
      story.pages.length
    ) {
      const pages: ComicPage[] = story.pages.map((page) => ({ ...page }));
      const refModel = CONFIG.OPENROUTER_IMAGES_REF_MODEL;
      const fallbackModel = CONFIG.OPENROUTER_IMAGES_MODEL;

      // 1) Anchor — generate scene 1 first (no reference). Its image becomes the
      //    visual reference that locks the character on every following page.
      let comicModel = refModel;
      let anchorUrl = await generateImage(
        buildComicPagePrompt(
          story,
          pages[0],
          0,
          pages.length,
          characterSheet,
          medium,
        ),
        `${slugBase}-p1`,
        {
          styleSuffix: styleSuffixes.comic,
          aspectRatio: "4:3",
          model: refModel,
        },
      );

      // If the primary model is unavailable, retry the anchor on the fallback
      // model so we still get images rather than producing none at all.
      if (!anchorUrl && refModel !== fallbackModel) {
        comicModel = fallbackModel;
        anchorUrl = await generateImage(
          buildComicPagePrompt(
            story,
            pages[0],
            0,
            pages.length,
            characterSheet,
            medium,
          ),
          `${slugBase}-p1`,
          {
            styleSuffix: styleSuffixes.comic,
            aspectRatio: "4:3",
            model: fallbackModel,
          },
        );
      }

      if (anchorUrl) {
        pages[0] = { ...pages[0], imageUrl: anchorUrl };
        // Incremental persist → reader poll reveals page 1 immediately.
        await updateDocument(storyId, { pages }, DBCollectionsEnum.stories);
      }

      // Pass the anchor to every follow-up scene — both Gemini and Grok accept
      // reference images for character consistency across scenes.
      const useReference = Boolean(anchorUrl);

      // 2) Remaining scenes — parallel, conditioned on the anchor when possible.
      const restIndexes = pages.map((_, i) => i).filter((i) => i !== 0);
      await mapWithConcurrency(restIndexes, 3, async (pageIndex) => {
        const url = await generateImage(
          buildComicPagePrompt(
            story,
            pages[pageIndex],
            pageIndex,
            pages.length,
            characterSheet,
            medium,
            useReference,
          ),
          `${slugBase}-p${pageIndex + 1}`,
          {
            styleSuffix: styleSuffixes.comic,
            aspectRatio: "4:3",
            model: comicModel,
            referenceImageUrls: useReference ? [anchorUrl as string] : undefined,
          },
        );
        if (url) {
          pages[pageIndex] = { ...pages[pageIndex], imageUrl: url };
          // Incremental persist → reader poll reveals pages as they finish.
          await updateDocument(storyId, { pages }, DBCollectionsEnum.stories);
        }
      });

      const anySucceeded = pages.some((page) => page.imageUrl);
      await updateDocument(
        storyId,
        { pages, imagesStatus: anySucceeded ? "ready" : "failed" },
        DBCollectionsEnum.stories,
      );
    } else {
      const refModel = CONFIG.OPENROUTER_IMAGES_REF_MODEL;
      const fallbackModel = CONFIG.OPENROUTER_IMAGES_MODEL;
      const longImages: LongStoryImage[] = deriveLongStoryImagePrompts(story, 2);

      // 1) Wide landscape cover — anchor for character consistency on interior scenes.
      let longModel = refModel;
      let coverUrl = await generateImage(
        buildCoverPrompt(story, characterSheet, medium),
        `${slugBase}-cover`,
        {
          styleSuffix: styleSuffixes.cover,
          aspectRatio: "16:9",
          model: refModel,
        },
      );

      if (!coverUrl && refModel !== fallbackModel) {
        longModel = fallbackModel;
        coverUrl = await generateImage(
          buildCoverPrompt(story, characterSheet, medium),
          `${slugBase}-cover`,
          {
            styleSuffix: styleSuffixes.cover,
            aspectRatio: "16:9",
            model: fallbackModel,
          },
        );
      }

      if (coverUrl) {
        await updateDocument(
          storyId,
          { coverImageUrl: coverUrl },
          DBCollectionsEnum.stories,
        );
      }

      const useReference = Boolean(coverUrl);

      // 2) Two interior illustrations from story segments.
      await mapWithConcurrency(longImages, 2, async (slot, slotIndex) => {
        const url = await generateImage(
          buildLongInteriorPrompt(
            story,
            slot,
            characterSheet,
            medium,
            useReference,
          ),
          `${slugBase}-scene-${slotIndex + 1}`,
          {
            styleSuffix: styleSuffixes.longInterior,
            aspectRatio: "16:9",
            model: longModel,
            referenceImageUrls: useReference ? [coverUrl as string] : undefined,
          },
        );
        if (url) {
          longImages[slotIndex] = { ...longImages[slotIndex], imageUrl: url };
          await updateDocument(
            storyId,
            { longStoryImages: [...longImages] },
            DBCollectionsEnum.stories,
          );
        }
      });

      const anySucceeded =
        Boolean(coverUrl) || longImages.some((img) => img.imageUrl);
      await updateDocument(
        storyId,
        {
          coverImageUrl: coverUrl ?? undefined,
          longStoryImages: longImages,
          imagesStatus: anySucceeded ? "ready" : "failed",
        },
        DBCollectionsEnum.stories,
      );
    }

    console.log("✅ Story images generated", {
      storyId,
      format: story.format ?? "long",
    });
  } catch (error) {
    console.error("❌ handleGenerateStoryImages failed", { storyId, error });
    try {
      await updateDocument(
        storyId,
        { imagesStatus: "failed" },
        DBCollectionsEnum.stories,
      );
    } catch {
      /* swallow — best effort */
    }
  }
};

import CONFIG from "../../config";
import { DBCollectionsEnum } from "../../models/mongoDb";
import { Story } from "../../models/types";
import fs from "fs";
import { optimizeToJpeg } from "../../utils/imageOptimize";
import puppeteer from "puppeteer";
import { updateDocument } from "../../models/mongoDb/crudOperations";
import { uploadFileToS3 } from "../amazonS3";

/**
 * eBook PDF export for a story (Feature B). A standalone, design-system-styled
 * HTML document is rendered to PDF with Puppeteer, then re-hosted on S3 — the
 * same persist-after-generate pattern used for audio and images. All art is
 * downscaled + inlined as base64 so the rendered PDF is self-contained, small,
 * and smooth to read. The PDF is generated ONCE per story and reused for both
 * download and email (cached on `Story.pdfUrl`, at a deterministic S3 key).
 *
 * MOBILE-SAFETY NOTE: the page art is composited into a SINGLE opaque background
 * per full-bleed page (one `background-image` stack with the photo at the bottom
 * + gradient scrims/stars layered on top). We deliberately avoid `opacity` on
 * full-bleed layers, separate semi-transparent overlay divs, and image
 * `border-radius`/`box-shadow`. Those constructs make Chrome emit transparency
 * groups + per-image soft-masks (and tile them), which old phones / in-browser
 * PDF viewers must composite pixel-by-pixel — the cause of the previous
 * janky-scroll / crash / won't-open behaviour. Opaque backgrounds rasterize to
 * a single image with no mask, so reading stays smooth.
 */

/** The stored story doc carries profileInfo even though the base type omits it. */
type StoryDoc = Story & {
  profileInfo?: {
    name?: string;
    age?: number;
    gender?: string;
    language?: { name?: string; value?: string };
  };
};

// V2 palette (inlined — the PDF is a standalone document with no app CSS vars).
const C = {
  honey300: "#F5C66D",
  honey400: "#F0B648",
  honey500: "#DD9812",
  twilight300: "#A7A0EC",
  twilight500: "#6664C0",
  plum700: "#0A0E2B",
  plum800: "#03051B",
  parchment100: "#FAF4EA",
  parchment200: "#F2EADD",
  parchment300: "#E4D9C9",
  ink: "#26223b",
};

const SCENE_GRADIENTS = [
  "linear-gradient(165deg,#3a2c66 0%,#7a4a5e 100%)",
  "linear-gradient(165deg,#2f3a6e 0%,#6b5a8e 100%)",
  "linear-gradient(165deg,#403063 0%,#8a5a48 100%)",
  "linear-gradient(165deg,#28315f 0%,#5a6aa0 100%)",
  "linear-gradient(165deg,#4a2f5e 0%,#9a6a52 100%)",
  "linear-gradient(165deg,#2c2a5e 0%,#6a4a7e 100%)",
];

// NOTE: a decorative star-field (6 alpha radial-gradients) used to overlay every
// full-bleed page. Even over an opaque base, Chrome emits one soft-mask PER alpha
// gradient layer (so the cover+end alone cost 13 masks) — and stacked soft-masks
// are precisely what made the PDF crash on old phones. Sparkles aren't worth that,
// so decorative pages now use a single opaque gradient base (zero masks).

// Bottom-anchored darkening so light text stays legible over the art. Bottom
// stop is strongly opaque; the top fades — but it always sits over an opaque
// photo/base, so the page as a whole is opaque.
const COVER_SCRIM =
  "linear-gradient(to top, rgba(3,5,27,0.92) 0%, rgba(3,5,27,0.55) 40%, rgba(3,5,27,0.18) 70%, rgba(3,5,27,0.40) 100%)";
const SCENE_SCRIM =
  "linear-gradient(to top, rgba(3,5,27,0.95) 0%, rgba(3,5,27,0.78) 26%, rgba(3,5,27,0.32) 60%, rgba(3,5,27,0.00) 100%)";
// Opaque bases used when there is no photo (gradient covers / the end page).
const COVER_BASE =
  "radial-gradient(ellipse at 50% 30%, #34336e 0%, #0A0E2B 60%, #03051B 100%)";
const END_BASE =
  "radial-gradient(ellipse at center, #2a2a63 0%, #0A0E2B 60%, #03051B 100%)";

const esc = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Light markdown → an array of paragraph <p> strings for long-story prose (no
 * full MD engine needed). Returning a list (not a joined string) lets the caller
 * splice interior illustrations between paragraphs.
 */
const proseParagraphs = (text: string): string[] =>
  String(text || "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const clean = esc(
        block.replace(/^#{1,6}\s*/g, "").replace(/[*_`]+/g, ""),
      );
      return `<p>${clean.replace(/\n/g, "<br/>")}</p>`;
    });

/**
 * Fetch an image URL, downscale + recompress it to a JPEG, and inline it as a
 * base64 data URI. Keeps the PDF small/smooth even when the source S3 image is
 * a large PNG. Falls back to the raw bytes if sharp can't process it; null on
 * fetch failure. 1280px is plenty for a 10in page and keeps the decoded bitmap
 * (what mobile viewers must hold in memory) small.
 */
const toDataUri = async (url?: string): Promise<string | null> => {
  if (!url) return null;
  try {
    const res = await (globalThis as { fetch: typeof fetch }).fetch(url);
    if (!res.ok) return null;
    const input = Buffer.from(await res.arrayBuffer());
    const jpeg = await optimizeToJpeg(input, 1280);
    if (jpeg) {
      return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
    }
    const contentType = res.headers.get("content-type") || "image/png";
    return `data:${contentType};base64,${input.toString("base64")}`;
  } catch {
    return null;
  }
};

const sanitizeFileName = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "story";

/** Build the full eBook HTML document for a story (10in × 7.5in storybook). */
export const buildStoryHtml = (
  story: StoryDoc,
  art: { cover: string | null; pages: (string | null)[] },
): string => {
  const name = story.profileInfo?.name || "you";
  const title = esc(story.title || "A Bedtime Story");
  const isComic =
    story.format === "comic" &&
    Array.isArray(story.pages) &&
    story.pages.length > 0;

  const docBg = isComic ? C.plum800 : C.parchment100;

  // ---- Cover page (both formats) ----
  // One opaque background: a darkening scrim over the photo (1 mask, for text
  // legibility), or just the opaque base gradient when there's no photo (0 masks).
  const coverUri = art.cover;
  const coverBg = coverUri ? `${COVER_SCRIM}, url('${coverUri}')` : COVER_BASE;
  const coverPage = `
    <section class="page cover" style="background-image:${coverBg}">
      <div class="cover-content">
        <div class="eyebrow">A TalePod bedtime story</div>
        <h1 class="cover-title">${title}</h1>
        <div class="cover-by">made just for ${esc(name)}</div>
        <div class="cover-orn">✦&nbsp;&nbsp;✶&nbsp;&nbsp;✦</div>
      </div>
      <div class="cover-brand">talepod.com</div>
    </section>`;

  // ---- Body pages ----
  let bodyPages = "";
  if (isComic) {
    const pages = story.pages || [];
    bodyPages = pages
      .map((page, i) => {
        const uri = art.pages[i] || null;
        const grad = SCENE_GRADIENTS[i % SCENE_GRADIENTS.length];
        // One opaque background: scrim over the photo (or over the opaque
        // placeholder gradient) — for caption legibility. One mask per scene.
        const sceneBg = uri
          ? `${SCENE_SCRIM}, url('${uri}')`
          : `${SCENE_SCRIM}, ${grad}`;
        return `
        <section class="page scene" style="background-image:${sceneBg}">
          <div class="caption">
            <div class="cap-text" dir="auto">${esc(page.caption)}</div>
          </div>
          <div class="page-no">${i + 1} / ${pages.length}</div>
        </section>`;
      })
      .join("\n");
  } else {
    const poem = story.poem
      ? `<div class="poem"><div class="poem-orn">✶</div><pre>${esc(
          story.poem,
        )}</pre></div>`
      : "";

    // Interleave the interior illustrations near the passages they were derived
    // from (~1/3 and ~2/3 through the prose — see deriveLongStoryImagePrompts),
    // so each picture sits beside the scene it depicts. Failed images are null.
    const paragraphs = proseParagraphs(story.mainStory);
    const interiors = (art.pages || []).filter(Boolean) as string[];
    const figureHtml = (uri: string): string =>
      `<figure class="prose-figure"><img src="${uri}" alt=""/></figure>`;

    let body: string;
    if (!paragraphs.length) {
      body = interiors.map(figureHtml).join("\n");
    } else {
      const figuresByParagraph = new Map<number, string[]>();
      interiors.forEach((uri, i) => {
        const ratio = interiors.length === 1 ? 0.5 : i === 0 ? 0.33 : 0.66;
        const idx = Math.min(
          paragraphs.length - 1,
          Math.max(0, Math.floor(paragraphs.length * ratio)),
        );
        figuresByParagraph.set(idx, [
          ...(figuresByParagraph.get(idx) || []),
          figureHtml(uri),
        ]);
      });
      body = paragraphs
        .map((paragraph, i) =>
          figuresByParagraph.has(i)
            ? [paragraph, ...(figuresByParagraph.get(i) as string[])].join("\n")
            : paragraph,
        )
        .join("\n");
    }

    bodyPages = `
      <div class="prose" dir="auto">
        <div class="prose-inner">
          <div class="prose-eyebrow">${esc(name)}'s story</div>
          ${body}
          ${poem}
        </div>
      </div>`;
  }

  // ---- Closing page ----
  const endPage = `
    <section class="page end" style="background-image:${END_BASE}">
      <div class="end-content">
        <div class="end-the">The End</div>
        <div class="end-sub">Sweet dreams, ${esc(name)}.</div>
        <div class="end-brand">TalePod</div>
        <div class="end-tag">Bedtime stories, made just for them · talepod.com</div>
      </div>
    </section>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Lexend+Deca:wght@400;500;600;700&family=Yeseva+One&display=swap" rel="stylesheet">
<style>
  @page { size: 10in 7.5in; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  html { background: ${docBg}; }
  body {
    font-family: 'Lexend Deca', 'Noto Sans Arabic', system-ui, sans-serif;
    color: ${C.ink};
  }
  :root { --edge: 40px; }

  /* Every full-bleed page paints its whole visual via a single opaque
     background stack (set inline) — no overlay divs, no opacity, no soft-mask. */
  .page {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
    background-color: ${C.plum800};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  /* ---------- Cover ---------- */
  .cover-content {
    position: absolute; left: var(--edge); right: var(--edge); bottom: 14%;
    text-align: center; z-index: 2;
  }
  .eyebrow {
    font-family: 'Caveat', cursive; font-size: 30px; font-weight: 700;
    color: ${C.honey300}; letter-spacing: 0.5px; margin-bottom: 6px;
  }
  .cover-title {
    font-family: 'Yeseva One', serif; font-weight: 400;
    font-size: 68px; line-height: 1.04; margin: 0 0 14px;
    color: #fff;
  }
  .cover-by {
    font-family: 'Caveat', cursive; font-size: 34px; font-weight: 700;
    color: ${C.parchment200};
  }
  .cover-orn { color: ${C.honey400}; font-size: 22px; letter-spacing: 4px; margin-top: 22px; }
  .cover-brand {
    position: absolute; bottom: calc(var(--edge) * 0.7); left: 0; right: 0;
    text-align: center; color: rgba(255,255,255,0.62);
    font-size: 13px; letter-spacing: 2px; text-transform: uppercase; z-index: 2;
  }

  /* ---------- Comic scene ---------- */
  .caption {
    position: absolute; left: 0; right: 0; bottom: 0;
    padding: 0 var(--edge) calc(var(--edge) * 0.9); z-index: 2;
  }
  .cap-eyebrow {
    font-family: 'Caveat', cursive; font-size: 28px; font-weight: 700;
    color: ${C.honey300}; margin-bottom: 4px;
  }
  .cap-text {
    font-family: 'Lexend Deca', 'Noto Sans Arabic', sans-serif;
    font-size: 23px; line-height: 1.5; font-weight: 500; color: ${C.parchment100};
    max-width: 8.6in;
  }
  .page-no {
    position: absolute; top: var(--edge); right: var(--edge); z-index: 3;
    background: ${C.plum700}; border: 1px solid ${C.twilight500};
    color: #fff; font-size: 13px; font-weight: 700;
    padding: 5px 12px; border-radius: 999px;
  }

  /* ---------- Long prose ---------- */
  /* break-after pushes the closing page onto its own sheet (the prose is a
     flowing block, not a fixed-height .page). */
  .prose {
    background: ${C.parchment100};
    padding: var(--edge) calc(var(--edge) + 0.35in);
    page-break-after: always;
    break-after: page;
  }
  .prose-inner { max-width: 7.4in; margin: 0 auto; }
  .prose-eyebrow {
    font-family: 'Caveat', cursive; font-size: 30px; font-weight: 700;
    color: ${C.honey500}; margin-bottom: 14px; text-align: center;
  }
  .prose p {
    font-size: 18px; line-height: 1.75; color: ${C.ink};
    margin: 0 0 15px; text-align: justify;
  }
  .prose p:first-of-type::first-letter {
    font-family: 'Yeseva One', serif; float: left; font-size: 64px;
    line-height: 0.82; padding: 6px 10px 0 0; color: ${C.honey500};
  }
  /* No border-radius / box-shadow on the image: those force a clip soft-mask +
     a blurred transparency group per figure. A flat opaque frame is print-safe. */
  .prose-figure {
    margin: 24px 0; text-align: center;
    break-inside: avoid; page-break-inside: avoid;
  }
  .prose-figure img {
    display: block; width: 100%; height: auto;
    border: 1px solid ${C.parchment300};
  }
  .poem { margin-top: 26px; padding-top: 18px; border-top: 1px solid ${C.parchment300}; text-align: center; }
  .poem-orn { color: ${C.honey400}; font-size: 20px; margin-bottom: 8px; }
  .poem pre {
    font-family: 'Caveat', cursive; font-size: 26px; line-height: 1.5;
    color: ${C.twilight500}; white-space: pre-wrap; margin: 0;
  }

  /* ---------- End page ---------- */
  .end-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; z-index: 2; padding: 0 var(--edge); }
  .end-the { font-family: 'Yeseva One', serif; font-size: 58px; color: #fff; margin-bottom: 8px; }
  .end-sub { font-family: 'Caveat', cursive; font-size: 32px; font-weight: 700; color: ${C.honey300}; margin-bottom: 40px; }
  .end-brand { font-family: 'Yeseva One', serif; font-size: 30px; color: ${C.honey400}; letter-spacing: 1px; }
  .end-tag { color: rgba(255,255,255,0.6); font-size: 13px; margin-top: 8px; letter-spacing: 0.5px; }
</style>
</head>
<body>
  ${coverPage}
  ${bodyPages}
  ${endPage}
</body>
</html>`;
};

/**
 * Render a story to a PDF Buffer with Puppeteer. Throws on launch/render
 * failure so callers can surface a clear error (download) or log (email).
 */
export const renderStoryPdfBuffer = async (
  story: StoryDoc,
): Promise<Buffer> => {
  const isComic =
    story.format === "comic" &&
    Array.isArray(story.pages) &&
    story.pages.length > 0;

  const [cover, pages] = await Promise.all([
    toDataUri(
      story.coverImageUrl || (isComic ? story.pages?.[0]?.imageUrl : undefined),
    ),
    isComic
      ? Promise.all((story.pages || []).map((p) => toDataUri(p.imageUrl)))
      : Promise.all(
          (story.longStoryImages || []).map((img) => toDataUri(img.imageUrl)),
        ),
  ]);

  const html = buildStoryHtml(story, { cover, pages });

  const browser = await puppeteer.launch({
    headless: true,
    // In production (Alpine Docker) we use the distro's Chromium via this env
    // var; locally it's unset and Puppeteer uses its bundled Chromium.
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    // All images are inlined as data URIs, so the only network is the web-font
    // stylesheet; "load" waits for it, then we wait for the fonts themselves.
    await page.setContent(html, { waitUntil: "load" });
    await page
      .evaluate(() => (document as any).fonts?.ready)
      .catch(() => undefined);
    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close().catch(() => undefined);
  }
};

/** Persist a rendered PDF buffer to S3 at a deterministic per-story key. */
const uploadStoryPdf = async (
  buffer: Buffer,
  story: StoryDoc,
): Promise<string> => {
  const dir = CONFIG.SERVER_PDFS_ABSOLUTE_PATH;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Stable filename per story → re-renders overwrite the same object instead
  // of piling up duplicates.
  const fileName = `${sanitizeFileName(
    story.slug || story.title || String(story._id),
  )}.pdf`;
  const filePath = `${dir}/${fileName}`;
  await fs.promises.writeFile(filePath, buffer as unknown as string);

  const url = await uploadFileToS3(fileName, filePath, {
    contentType: "application/pdf",
    keyPrefix: CONFIG.SERVER_PDFS_PATH,
  });

  fs.promises.unlink(filePath).catch(() => undefined);
  return url;
};

/**
 * Bump when the PDF render pipeline changes in a way that should invalidate
 * already-cached PDFs. v2 = mobile-safe flattened render (single opaque page
 * backgrounds, no soft-mask / transparency-group explosion) — v1 PDFs scrolled
 * badly and crashed / would not open on older phones.
 */
const PDF_RENDERER_VERSION = 2;

/**
 * Return the story's eBook PDF URL, generating + persisting it once and caching
 * `Story.pdfUrl`. Reuses the cached URL on subsequent calls (download + email
 * share the same file) — but only when it was built by the CURRENT renderer
 * version, so this fix re-renders every stale PDF exactly once on next access.
 * The cache is only written once images have settled, so a placeholder PDF is
 * never cached permanently.
 */
export const getStoryPdfUrl = async (story: StoryDoc): Promise<string> => {
  const imagesReady = story.imagesStatus !== "pending";
  const cacheFresh = story.pdfVersion === PDF_RENDERER_VERSION;
  if (imagesReady && story.pdfUrl && cacheFresh) return story.pdfUrl;

  const buffer = await renderStoryPdfBuffer(story);
  const url = await uploadStoryPdf(buffer, story);

  if (imagesReady) {
    await updateDocument(
      String(story._id),
      { pdfUrl: url, pdfVersion: PDF_RENDERER_VERSION },
      DBCollectionsEnum.stories,
    ).catch(() => undefined);
  }

  return url;
};

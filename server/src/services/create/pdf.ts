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

const STAR_FIELD =
  "radial-gradient(circle at 18% 20%, rgba(245,198,109,0.9) 0 2.4px, transparent 3px)," +
  "radial-gradient(circle at 80% 28%, rgba(255,255,255,0.8) 0 2px, transparent 3px)," +
  "radial-gradient(circle at 64% 64%, rgba(245,198,109,0.7) 0 1.8px, transparent 3px)," +
  "radial-gradient(circle at 33% 80%, rgba(255,255,255,0.6) 0 1.4px, transparent 3px)," +
  "radial-gradient(circle at 50% 44%, rgba(255,255,255,0.5) 0 1.2px, transparent 3px)," +
  "radial-gradient(circle at 88% 75%, rgba(245,198,109,0.55) 0 1.6px, transparent 3px)";

const esc = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Light markdown → paragraphs for long-story prose (no full MD engine needed). */
const proseParagraphs = (text: string): string =>
  String(text || "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const clean = esc(block.replace(/^#{1,6}\s*/g, "").replace(/[*_`]+/g, ""));
      return `<p>${clean.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

/**
 * Fetch an image URL, downscale + recompress it to a JPEG, and inline it as a
 * base64 data URI. Keeps the PDF small/smooth even when the source S3 image is
 * a large PNG. Falls back to the raw bytes if sharp can't process it; null on
 * fetch failure.
 */
const toDataUri = async (url?: string): Promise<string | null> => {
  if (!url) return null;
  try {
    const res = await (globalThis as { fetch: typeof fetch }).fetch(url);
    if (!res.ok) return null;
    const input = Buffer.from(await res.arrayBuffer());
    const jpeg = await optimizeToJpeg(input, 1600);
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
const buildStoryHtml = (
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
  const coverUri = art.cover;
  const coverPage = `
    <section class="page cover">
      <div class="cover-bg${coverUri ? "" : " is-gradient"}" ${
        coverUri ? `style="background-image:url('${coverUri}')"` : ""
      }></div>
      <div class="cover-stars"></div>
      <div class="cover-scrim"></div>
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
        const artLayer = uri
          ? `<div class="scene-art" style="background-image:url('${uri}')"></div>`
          : `<div class="scene-art placeholder" style="background-image:${STAR_FIELD},${grad}"></div>`;
        return `
        <section class="page scene">
          ${artLayer}
          <div class="scene-scrim"></div>
          <div class="caption">
            <div class="cap-eyebrow">Page ${i + 1}</div>
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
    bodyPages = `
      <div class="prose" dir="auto">
        <div class="prose-inner">
          <div class="prose-eyebrow">${esc(name)}'s story</div>
          ${proseParagraphs(story.mainStory)}
          ${poem}
        </div>
      </div>`;
  }

  // ---- Closing page ----
  const endPage = `
    <section class="page end">
      <div class="end-stars"></div>
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

  .page {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
  }

  /* ---------- Cover ---------- */
  .cover { background: radial-gradient(ellipse at top, #2a2a63 0%, ${C.plum700} 58%, ${C.plum800} 100%); }
  .cover-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
  }
  .cover-bg.is-gradient { background: radial-gradient(ellipse at 50% 30%, #34336e 0%, ${C.plum700} 60%, ${C.plum800} 100%); }
  .cover-stars { position: absolute; inset: 0; background-image: ${STAR_FIELD}; opacity: 0.9; }
  .cover-scrim {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(3,5,27,0.92) 0%, rgba(3,5,27,0.55) 40%, rgba(3,5,27,0.18) 70%, rgba(3,5,27,0.4) 100%);
  }
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
    color: #fff; text-shadow: 0 4px 22px rgba(0,0,0,0.45);
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
  .scene { background: ${C.plum800}; }
  .scene-art { position: absolute; inset: 0; background-size: cover; background-position: center; }
  .scene-scrim {
    position: absolute; left: 0; right: 0; bottom: 0; height: 50%;
    background: linear-gradient(to top, rgba(3,5,27,0.92) 0%, rgba(3,5,27,0.74) 26%, rgba(3,5,27,0.3) 64%, rgba(3,5,27,0) 100%);
  }
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
    max-width: 8.6in; text-shadow: 0 1px 3px rgba(0,0,0,0.55);
  }
  .page-no {
    position: absolute; top: var(--edge); right: var(--edge); z-index: 3;
    background: rgba(3,5,27,0.5); border: 1px solid rgba(255,255,255,0.22);
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
  .poem { margin-top: 26px; padding-top: 18px; border-top: 1px solid ${C.parchment300}; text-align: center; }
  .poem-orn { color: ${C.honey400}; font-size: 20px; margin-bottom: 8px; }
  .poem pre {
    font-family: 'Caveat', cursive; font-size: 26px; line-height: 1.5;
    color: ${C.twilight500}; white-space: pre-wrap; margin: 0;
  }

  /* ---------- End page ---------- */
  .end { background: radial-gradient(ellipse at center, #2a2a63 0%, ${C.plum700} 60%, ${C.plum800} 100%); }
  .end-stars { position: absolute; inset: 0; background-image: ${STAR_FIELD}; opacity: 0.8; }
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
      story.coverImageUrl ||
        (isComic ? story.pages?.[0]?.imageUrl : undefined),
    ),
    isComic
      ? Promise.all((story.pages || []).map((p) => toDataUri(p.imageUrl)))
      : Promise.resolve([]),
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
  await fs.promises.writeFile(filePath, buffer);

  const url = await uploadFileToS3(fileName, filePath, {
    contentType: "application/pdf",
    keyPrefix: CONFIG.SERVER_PDFS_PATH,
  });

  fs.promises.unlink(filePath).catch(() => undefined);
  return url;
};

/**
 * Return the story's eBook PDF URL, generating + persisting it once and caching
 * `Story.pdfUrl`. Reuses the cached URL on subsequent calls (download + email
 * share the same file). The cache is only written once images have settled, so
 * a placeholder PDF is never cached permanently.
 */
export const getStoryPdfUrl = async (story: StoryDoc): Promise<string> => {
  const imagesReady = story.imagesStatus !== "pending";
  if (imagesReady && story.pdfUrl) return story.pdfUrl;

  const buffer = await renderStoryPdfBuffer(story);
  const url = await uploadStoryPdf(buffer, story);

  if (imagesReady) {
    await updateDocument(
      String(story._id),
      { pdfUrl: url },
      DBCollectionsEnum.stories,
    ).catch(() => undefined);
  }

  return url;
};

import { Plugin, defineConfig, loadEnv } from "vite";

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "path";
import prerender from "vite-plugin-prerender";
import { prerenderPaths, sitemapPaths } from "./src/application/routes";
import react from "@vitejs/plugin-react";

const require = createRequire(import.meta.url);
const { sanitizePrerenderedHtml } = require("./scripts/sanitize-prerender-html.js");

/** Mirrors APP_CONSTANTS.APP_URL resolution for build-time sitemap generation. */
const resolveAppUrl = (env: Record<string, string>): string => {
  const isDev =
    env.REACT_APP_ENV === "local" || env.REACT_APP_ENV === "development";
  return isDev ? "https://dev.talepod.com" : "https://www.talepod.com";
};

/**
 * Writes dist/sitemap.xml (the location referenced by public/robots.txt) with
 * the indexable, locale-prefixed marketing URLs.
 */
function sitemapPlugin(siteUrl: string): Plugin {
  const origin = siteUrl.replace(/\/$/, "");

  return {
    name: "generate-sitemap",
    apply: "build",
    closeBundle() {
      const lastmod = new Date().toISOString();
      const urls = sitemapPaths
        .map((pathname) => {
          const priority = /^\/[a-z]{2}$/.test(pathname) ? "1.0" : "0.7";
          return `  <url>\n    <loc>${origin}${pathname}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
        })
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

      const outputPath = path.join(__dirname, "dist", "sitemap.xml");
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, xml, "utf8");

      console.log(
        `[sitemap] Wrote ${sitemapPaths.length} URLs to ${outputPath}`,
      );
    },
  };
}

/**
 * vite-plugin-prerender depends on puppeteer@1.x; we override puppeteer to
 * puppeteer-core@24 (package.json resolutions) so Node 22+ can drive Chrome over CDP.
 */
function resolveLocalChromeExecutable(): string {
  const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (fromEnv && fs.existsSync(fromEnv)) {
    return fromEnv;
  }

  const candidates: string[] = [];
  if (process.platform === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    );
  } else if (process.platform === "win32") {
    const pf = process.env.PROGRAMFILES ?? "C:\\Program Files";
    const pf86 = process.env["PROGRAMFILES(X86)"] ?? "C:\\Program Files (x86)";
    candidates.push(
      `${pf}\\Google\\Chrome\\Application\\chrome.exe`,
      `${pf86}\\Google\\Chrome\\Application\\chrome.exe`,
    );
  }

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error(
    `[prerender] No Chrome/Chromium found for ${process.platform}. Install Google Chrome or set PUPPETEER_EXECUTABLE_PATH. Checked: ${candidates.join(", ")}`,
  );
}

async function getPuppeteerOptions(): Promise<Record<string, unknown>> {
  const extraArgs = ["--disable-dev-shm-usage"];

  if (process.platform === "linux") {
    const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (fromEnv && fs.existsSync(fromEnv)) {
      return {
        executablePath: fromEnv,
        args: ["--no-sandbox", "--disable-setuid-sandbox", ...extraArgs],
        headless: "shell",
      };
    }
    const { default: chromium } = await import("@sparticuz/chromium");
    return {
      executablePath: await chromium.executablePath(),
      args: [...chromium.args, ...extraArgs],
      headless: "shell",
    };
  }

  return {
    executablePath: resolveLocalChromeExecutable(),
    args: ["--no-sandbox", "--disable-setuid-sandbox", ...extraArgs],
    headless: "shell",
  };
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "REACT_APP_");
  const puppeteerOptions = await getPuppeteerOptions();
  const siteUrl = resolveAppUrl(env);

  return {
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
      }),
      sitemapPlugin(siteUrl),
      prerender({
        staticDir: path.join(__dirname, "dist"),
        routes: prerenderPaths,
        renderer: new prerender.PuppeteerRenderer({
          viewport: { width: 1280, height: 800 },
          renderAfterTime: 5000,
          maxConcurrentRoutes: 1,
          skipThirdPartyRequests: true,
          inject: { isPrerendering: true },
          ...puppeteerOptions,
        }),
        postProcess(renderedRoute) {
          renderedRoute.html = renderedRoute.html.replace(
            /http:\/\/localhost:\d+\//g,
            "/",
          );

          const localeMatch = renderedRoute.route.match(/^\/([a-z]{2})(?:\/|$)/);
          if (localeMatch) {
            const locale = localeMatch[1];
            const dir = locale === "ar" ? "rtl" : "ltr";
            renderedRoute.html = renderedRoute.html.replace(
              /<html lang="[^"]*">/,
              `<html lang="${locale}" dir="${dir}">`,
            );
          }

          renderedRoute.html = sanitizePrerenderedHtml(renderedRoute.html);
          return renderedRoute;
        },
      }),
    ],
    optimizeDeps: {
      include: ["@emotion/styled", "@emotion/react"],
    },
    server: {
      port: Number(env.REACT_APP_PORT || 1601),
    },
    build: {
      outDir: "dist",
    },
    envPrefix: "REACT_APP_",
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
      },
    },
  };
});

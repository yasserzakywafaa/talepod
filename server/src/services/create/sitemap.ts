import { existsSync, readFileSync, writeFileSync } from "fs";

import path from "path";

export interface AddUrlToSiteMapParams {
  url: string;
  siteMapFileName: string;
}

export const handleAddUrlToSitemapLocally = (props: AddUrlToSiteMapParams) => {
  const { siteMapFileName, url } = props;
  const CLIENT_PUBLIC_DIR = path.join(__dirname, "../../../../client/public");
  const sitemapPath = path.join(
    CLIENT_PUBLIC_DIR,
    siteMapFileName || "sitemap-blogs.xml"
  );

  // Ensure URL formatting consistency
  const formattedUrl = url.replace(/\/+/g, "/"); // Remove duplicate slashes
  const newUrlEntry = `
  <url>
    <loc>${formattedUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`;

  console.log("🔗 Blog:>>>", { CLIENT_PUBLIC_DIR, sitemapPath });

  try {
    // Create initial sitemap if it doesn't exist
    if (!existsSync(sitemapPath)) {
      const initialContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${newUrlEntry}
    </urlset>`;

      writeFileSync(sitemapPath, initialContent);
      return;
    }

    // Update existing sitemap
    const currentContent = readFileSync(sitemapPath, "utf8");

    // Simple duplicate check
    if (currentContent.includes(url)) {
      console.log("URL already exists in sitemap");
      return;
    }

    // Insert new entry before closing </urlset> tag
    const updatedContent = currentContent.replace(
      "</urlset>",
      `${newUrlEntry}\n</urlset>`
    );

    writeFileSync(sitemapPath, updatedContent);
  } catch (error) {
    console.error("❌  Error updating sitemap:", error);
    throw new Error(`❌  Failed to update sitemap at ${sitemapPath}`);
  }
};

export const handleAddUrlToSitemap = async (
  fileContent: string,
  newUrls: string[]
): Promise<string> => {
  const updatedUrlsContent = newUrls.map((url) => {
    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`;
  });

  const updatedContent = fileContent.replace(
    "</urlset>",
    `${updatedUrlsContent.join("\n")}\n</urlset>`
  );

  return updatedContent;
};

const SITE_ORIGIN = "https://www.talepod.com";

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}

function getOrCreateMetaByName(name: string): HTMLMetaElement {
  let meta = document.querySelector(
    `meta[name="${name}"]`,
  ) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  return meta;
}

function getOrCreateMetaByProperty(property: string): HTMLMetaElement {
  let meta = document.querySelector(
    `meta[property="${property}"]`,
  ) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  return meta;
}

function getOrCreateMetaById(id: string): HTMLMetaElement | null {
  return document.getElementById(id) as HTMLMetaElement | null;
}

function getOrCreateCanonicalLink(): HTMLLinkElement {
  let link = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  return link;
}

export interface PageSeoMeta {
  title: string;
  description?: string;
  canonicalPath?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export function applyPageSeoMeta({
  title,
  description,
  canonicalPath,
  ogTitle,
  ogDescription,
}: PageSeoMeta): void {
  document.title = title;

  if (description) {
    getOrCreateMetaByName("description").setAttribute("content", description);
  }

  if (canonicalPath) {
    getOrCreateCanonicalLink().setAttribute(
      "href",
      absoluteUrl(canonicalPath),
    );
  }

  const resolvedOgTitle = ogTitle ?? title;
  const resolvedOgDescription = ogDescription ?? description;

  if (resolvedOgTitle) {
    getOrCreateMetaById("og-title")?.setAttribute("content", resolvedOgTitle);
    getOrCreateMetaById("twitter-title")?.setAttribute(
      "content",
      resolvedOgTitle,
    );
  }

  if (resolvedOgDescription) {
    getOrCreateMetaById("og-description")?.setAttribute(
      "content",
      resolvedOgDescription,
    );
    getOrCreateMetaById("twitter-description")?.setAttribute(
      "content",
      resolvedOgDescription,
    );
  }

  if (canonicalPath) {
    getOrCreateMetaByProperty("og:url").setAttribute(
      "content",
      absoluteUrl(canonicalPath),
    );
  }
}

import "server-only";

const FETCH_TIMEOUT_MS = 6000;
const AMAZON_IMAGE_HOSTS = [
  "media-amazon.com",
  "ssl-images-amazon.com",
  "images-amazon.com",
];
const AMAZON_SHORT_HOSTS = new Set(["a.co", "amzn.to", "amzn.eu", "amzn.asia", "amzn.com"]);

function decodeHtmlAttribute(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeEscapedUrl(value: string): string {
  return decodeHtmlAttribute(value)
    .replace(/\\u002F/gi, "/")
    .replace(/\\\//g, "/")
    .trim();
}

function getAttribute(tag: string, attribute: string): string | null {
  const match = tag.match(new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match ? decodeHtmlAttribute(match[2]) : null;
}

function isAmazonHost(host: string): boolean {
  return /(^|\.)amazon\.[a-z]{2,}(\.[a-z]{2,})?$/.test(host);
}

function isAmazonImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return AMAZON_IMAGE_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

function extractAmazonAsin(value: string): string | null {
  try {
    const url = new URL(value);
    const asinParam = url.searchParams.get("asin") ?? url.searchParams.get("ASIN");
    if (asinParam && /^[A-Z0-9]{10}$/i.test(asinParam)) return asinParam.toUpperCase();

    const path = decodeURIComponent(url.pathname);
    const patterns = [
      /\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})(?:[/?#]|$)/i,
      /\/([A-Z0-9]{10})(?:[/?#]|$)/i,
    ];
    for (const pattern of patterns) {
      const match = path.match(pattern);
      if (match) return match[1].toUpperCase();
    }
  } catch {
    return null;
  }
  return null;
}

function shouldFetchAmazonPreview(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (AMAZON_SHORT_HOSTS.has(host)) return true;
    return isAmazonHost(host) && Boolean(extractAmazonAsin(value));
  } catch {
    return false;
  }
}

function firstValidImage(candidates: string[], pageUrl: string): string | null {
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const absolute = new URL(normalizeEscapedUrl(candidate), pageUrl).toString();
      if (isAmazonImageUrl(absolute)) return absolute;
    } catch {
      // Ignore malformed candidates and keep scanning the page.
    }
  }
  return null;
}

function extractMetaImageCandidates(html: string): string[] {
  const candidates: string[] = [];
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of metaTags) {
    const property = (getAttribute(tag, "property") ?? getAttribute(tag, "name"))?.toLowerCase();
    if (property !== "og:image" && property !== "twitter:image") continue;
    const content = getAttribute(tag, "content");
    if (content) candidates.push(content);
  }
  return candidates;
}

export function extractAmazonImageFromHtml(html: string, pageUrl: string): string | null {
  const candidates: string[] = [];

  for (const match of html.matchAll(/\bdata-old-hires\s*=\s*(["'])(.*?)\1/gi)) {
    candidates.push(match[2]);
  }
  for (const match of html.matchAll(/"hiRes"\s*:\s*"([^"]+)"/gi)) {
    candidates.push(match[1]);
  }
  for (const match of html.matchAll(/"large"\s*:\s*"([^"]+)"/gi)) {
    candidates.push(match[1]);
  }

  const imageTags = html.match(/<img\b[^>]*>/gi) ?? [];
  for (const tag of imageTags) {
    if (getAttribute(tag, "id") === "landingImage") {
      const src = getAttribute(tag, "src");
      if (src) candidates.push(src);
    }
  }

  candidates.push(...extractMetaImageCandidates(html));
  return firstValidImage(candidates, pageUrl);
}

export async function fetchAmazonImagePreview(url: string): Promise<string | null> {
  if (!shouldFetchAmazonPreview(url)) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
      },
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("text/html")) return null;

    const html = await response.text();
    if (/captcha|robot check|enter the characters you see below/i.test(html)) return null;
    return extractAmazonImageFromHtml(html, response.url || url);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchAmazonImagePreviews(urls: string[]): Promise<string[]> {
  const previews = await Promise.all(urls.map((url) => fetchAmazonImagePreview(url)));
  return previews.map((preview) => preview ?? "");
}

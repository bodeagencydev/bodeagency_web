import * as cheerio from "cheerio";

export async function fetchProductDetails(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; UGCConceptBot/1.0)"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to fetch the product URL.");
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title =
    $("meta[property='og:title']").attr("content") ||
    $("meta[name='twitter:title']").attr("content") ||
    $("title").text().trim() ||
    "Untitled Product";

  const description =
    $("meta[property='og:description']").attr("content") ||
    $("meta[name='description']").attr("content") ||
    $("p").first().text().trim() ||
    "No product description was found.";

  const image =
    $("meta[property='og:image']").attr("content") ||
    $("meta[name='twitter:image']").attr("content") ||
    $("img").first().attr("src") ||
    null;

  const resolvedImage = image ? new URL(image, url).toString() : null;

  return {
    title,
    description,
    image: resolvedImage
  };
}

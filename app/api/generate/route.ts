import { fetchProductDetails } from "@/lib/product-scraper";
import { generateUGCConcept } from "@/lib/ugc-generator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productUrl, productName } = await request.json();

    if (!productUrl || typeof productUrl !== "string") {
      return NextResponse.json({ error: "Product URL is required." }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(productUrl);
    } catch {
      return NextResponse.json({ error: "Please enter a valid product URL." }, { status: 400 });
    }

    const product = await fetchProductDetails(parsedUrl.toString());
    const concept = await generateUGCConcept({
      url: parsedUrl.toString(),
      title: product.title,
      description: product.description,
      image: product.image,
      productName
    });

    return NextResponse.json({ concept });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate concept.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

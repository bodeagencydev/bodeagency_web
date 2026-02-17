import { UGCConcept } from "@/types/ugc";

type ProductInput = {
  url: string;
  title: string;
  description: string;
  image: string | null;
  productName?: string;
};

function buildFallbackConcept(product: ProductInput): UGCConcept {
  const name = product.productName?.trim() || product.title;

  return {
    product: {
      url: product.url,
      title: name,
      description: product.description,
      image: product.image
    },
    hook: `I found ${name} and honestly didn't expect this much of a difference in one day.`,
    script:
      `Okay, quick honest review. I started using ${name} this week and it instantly became part of my routine. ` +
      `What sold me was how easy it is and how quickly I noticed results. If you're looking for something that feels simple but actually works, this is worth trying.`,
    scenes: [
      {
        scene: 1,
        visual: "Creator talking selfie-style, product in hand.",
        direction: "Natural lighting, direct-to-camera intro.",
        voiceover: `I did not expect ${name} to be this good.`
      },
      {
        scene: 2,
        visual: "Close-up of product packaging.",
        direction: "Slow pan over key product details.",
        voiceover: "First impression: it looks premium and super easy to use."
      },
      {
        scene: 3,
        visual: "Product being used in everyday setting.",
        direction: "Quick cuts showing setup and use.",
        voiceover: "It fits right into my day without any extra effort."
      },
      {
        scene: 4,
        visual: "Before/after reaction shot.",
        direction: "Split-screen style comparison.",
        voiceover: "I noticed a real difference almost immediately."
      },
      {
        scene: 5,
        visual: "Creator sharing final thoughts.",
        direction: "Direct testimonial with authentic smile.",
        voiceover: `If you're on the fence, ${name} is genuinely worth a try.`
      }
    ],
    voiceover:
      `I found ${name} and had to share it. It's super easy to use, fits into my routine, and I noticed a difference fast. ` +
      "If you want something simple that actually delivers, you'll probably love this.",
    cta: `Tap the link and try ${name} for yourself.`
  };
}

export async function generateUGCConcept(product: ProductInput): Promise<UGCConcept> {
  if (!process.env.OPENAI_API_KEY) {
    return buildFallbackConcept(product);
  }

  const prompt = `Create a short UGC video concept from this product data. Return strict JSON with keys: hook, script, scenes, voiceover, cta.
Product title: ${product.productName || product.title}
Product description: ${product.description}
Rules:
- hook: 1 sentence
- script: 30-45 seconds spoken naturally
- scenes: array with 5-7 scenes. each scene includes scene (number), visual, direction, voiceover
- cta: concise and persuasive`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You write high-converting, authentic UGC ad concepts in natural human language."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8
    })
  });

  if (!response.ok) {
    return buildFallbackConcept(product);
  }

  const json = await response.json();
  const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? "{}");

  return {
    product: {
      url: product.url,
      title: product.productName || product.title,
      description: product.description,
      image: product.image
    },
    hook: parsed.hook,
    script: parsed.script,
    scenes: parsed.scenes,
    voiceover: parsed.voiceover,
    cta: parsed.cta
  };
}

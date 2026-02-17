# UGC Concept Generator (Next.js)

A modern SaaS-style AI app that turns any product URL into a UGC-style video concept.

## Features

- Landing page with hero + product input form
- Generate button with loading state
- Product page scraping (title, description, image)
- AI generation for hook, script, scene plan, voiceover, and CTA
- Email capture gate before results
- Results experience with clean cards and mobile responsive layout
- Placeholder video preview section
- Contact CTA for full video production
- Serverless API routes (App Router)

## Tech stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- Cheerio for product page parsing
- OpenAI API (optional, automatic fallback content if key missing)

## Project structure

```txt
.
├── app
│   ├── api
│   │   ├── capture-email/route.ts
│   │   └── generate/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib
│   ├── email-store.ts
│   ├── product-scraper.ts
│   └── ugc-generator.ts
├── types
│   └── ugc.ts
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

3. Add your OpenAI API key in `.env.local` (optional):

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is missing, the app returns high-quality fallback copy.

4. Run the app:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000).

## API endpoints

### `POST /api/generate`

Body:

```json
{
  "productUrl": "https://example.com/product",
  "productName": "Optional custom name"
}
```

Returns structured concept JSON.

### `POST /api/capture-email`

Body:

```json
{
  "email": "user@example.com"
}
```

Stores email in an in-memory array (`lib/email-store.ts`).

## Deploy to Vercel

1. Push repository to GitHub.
2. Import project into Vercel.
3. Add environment variables in Vercel project settings:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional)
4. Click **Deploy**.
5. Vercel automatically builds and hosts your serverless routes.

## Notes

- Email capture is intentionally in-memory for demo simplicity (resets on deploy/restart).
- Some websites may block scraping requests; API returns clear error messages when URL fetch fails.

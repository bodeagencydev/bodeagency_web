"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { UGCConcept } from "@/types/ugc";

type Stage = "form" | "loading" | "email" | "result";

export default function HomePage() {
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [error, setError] = useState("");
  const [concept, setConcept] = useState<UGCConcept | null>(null);

  const title = useMemo(() => concept?.product.title || "Your generated concept", [concept]);

  async function handleGenerate(event: FormEvent) {
    event.preventDefault();
    setError("");
    setStage("loading");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productUrl, productName })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not generate concept.");
      }

      setConcept(data.concept);
      setStage("email");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStage("form");
    }
  }

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save email.");
      }

      setStage("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit email.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
          <p className="mb-3 inline-flex rounded-full border border-brand-500/40 bg-brand-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-50">
            AI UGC Studio
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
            Turn any product into a UGC ad in seconds
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Drop a product URL and instantly get a hook, authentic creator script, scene plan, voiceover, and CTA.
          </p>

          {stage === "form" || stage === "loading" ? (
            <form onSubmit={handleGenerate} className="mt-8 grid gap-4 md:grid-cols-3">
              <input
                type="url"
                required
                value={productUrl}
                onChange={(event) => setProductUrl(event.target.value)}
                placeholder="https://example.com/product"
                className="col-span-2 rounded-xl border border-white/10 bg-slate-900/70 p-3 outline-none ring-brand-500 transition focus:ring"
              />
              <input
                type="text"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                placeholder="Product name (optional)"
                className="rounded-xl border border-white/10 bg-slate-900/70 p-3 outline-none ring-brand-500 transition focus:ring"
              />
              <button
                type="submit"
                disabled={stage === "loading"}
                className="col-span-full rounded-xl bg-brand-500 px-5 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-70"
              >
                {stage === "loading" ? "Generating..." : "Generate Video Concept"}
              </button>
            </form>
          ) : null}

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

          {stage === "email" ? (
            <form onSubmit={handleEmailSubmit} className="mt-8 max-w-xl space-y-3">
              <h2 className="text-xl font-semibold">Get your concept</h2>
              <p className="text-slate-300">Enter your email to unlock the full UGC video concept.</p>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-3 outline-none ring-brand-500 transition focus:ring"
                />
                <button className="rounded-xl bg-brand-500 px-5 py-3 font-semibold hover:bg-brand-600">Unlock Results</button>
              </div>
            </form>
          ) : null}
        </header>

        {stage === "result" && concept ? (
          <section className="grid gap-6 md:grid-cols-3">
            <article className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:col-span-2">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <div>
                <h3 className="font-semibold text-brand-50">Hook</h3>
                <p className="mt-1 text-slate-200">{concept.hook}</p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-50">UGC Script</h3>
                <p className="mt-1 text-slate-200">{concept.script}</p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-50">Scene Breakdown</h3>
                <ul className="mt-2 space-y-3">
                  {concept.scenes.map((scene) => (
                    <li key={scene.scene} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                      <p className="font-medium">Scene {scene.scene}</p>
                      <p className="text-sm text-slate-300">Visual: {scene.visual}</p>
                      <p className="text-sm text-slate-300">Direction: {scene.direction}</p>
                      <p className="text-sm text-slate-300">Voiceover: {scene.voiceover}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-50">Voiceover Text</h3>
                <p className="mt-1 text-slate-200">{concept.voiceover}</p>
              </div>
              <div>
                <h3 className="font-semibold text-brand-50">CTA</h3>
                <p className="mt-1 text-slate-200">{concept.cta}</p>
              </div>
            </article>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold">Product Snapshot</h3>
                {concept.product.image ? (
                  <Image
                    src={concept.product.image}
                    alt={concept.product.title}
                    width={600}
                    height={360}
                    className="mt-3 h-48 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="mt-3 flex h-48 items-center justify-center rounded-xl bg-slate-900/70 text-sm text-slate-400">
                    No image available
                  </div>
                )}
                <p className="mt-3 text-sm text-slate-300">{concept.product.description}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold">Placeholder Video Preview</h3>
                <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-dashed border-white/20 bg-slate-900/60 text-sm text-slate-400">
                  Video preview coming soon
                </div>
              </div>
            </aside>
          </section>
        ) : null}

        <section className="rounded-3xl border border-white/10 bg-brand-500/10 p-6">
          <h2 className="text-2xl font-semibold">Need the full video created? Contact us.</h2>
          <p className="mt-2 max-w-2xl text-slate-300">
            We can turn your concept into a polished, conversion-focused UGC ad with creators, editing, and delivery in days.
          </p>
          <a
            href="mailto:hello@bodeagency.com"
            className="mt-4 inline-flex rounded-xl bg-brand-500 px-5 py-3 font-semibold hover:bg-brand-600"
          >
            Contact the team
          </a>
        </section>
      </div>
    </main>
  );
}

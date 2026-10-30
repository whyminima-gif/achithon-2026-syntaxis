import { db } from "@/db";
import PrivacyAnalyzer from "@/components/privacy-analyzer";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await db.execute(sql`select 1`);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-900 text-zinc-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-10">
        <header className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-400">
            Explainable App Privacy & Permissions
          </p>
          <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Are your apps quietly overreaching?
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Paste an <code className="rounded bg-zinc-900 px-1 py-0.5 text-xs text-zinc-100">AndroidManifest.xml</code> and a
            privacy policy. We&apos;ll translate the legal and technical noise into a clear, human explanation of risk.
          </p>
        </header>

        <section className="flex flex-1 flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-7/12">
            {/* Client-side analyzer form */}
            <PrivacyAnalyzer />
          </div>

          <aside className="w-full space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 text-sm text-zinc-300 shadow-[0_18px_50px_rgba(0,0,0,0.5)] lg:w-5/12">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Pitch this in 30 seconds
            </h2>
            <p className="text-sm text-zinc-300">
              "Most of us blindly tap <span className="font-semibold text-emerald-400">Allow</span> on app permissions.
              Our analyzer reads the manifest and privacy policy, then gives non-technical users a simple risk score and
              flags anything unexpected—before their data is on the line."
            </p>
            <div className="space-y-2 text-xs text-zinc-500">
              <p className="font-medium text-zinc-400">Under the hood</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Next.js + PostgreSQL via Drizzle</li>
                <li>Manifest permission extraction and classification</li>
                <li>OpenAI-powered plain-language explanations</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

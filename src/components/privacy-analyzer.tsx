"use client";

import { useState } from "react";

type AnalysisResult = {
  riskScore: number;
  riskLevel: string;
  headline: string;
  summary: string;
  permissionsOverview: string;
  unexpectedPermissions: string[];
  policySummary: string;
  actionRecommendation: string;
};

type ApiResponse = {
  appName: string;
  permissions: string[];
  dangerousPermissionLabels: string[];
  analysis: AnalysisResult;
};

function riskColor(riskLevel: string): string {
  const level = riskLevel.toLowerCase();
  if (level === "low") return "bg-emerald-500";
  if (level === "medium") return "bg-amber-500";
  if (level === "high") return "bg-rose-500";
  return "bg-zinc-500";
}

function riskLabel(riskLevel: string): string {
  const level = riskLevel.toLowerCase();
  if (level === "low") return "Low risk";
  if (level === "medium") return "Medium risk";
  if (level === "high") return "High risk";
  return riskLevel || "Unknown";
}

export default function PrivacyAnalyzer() {
  const [appName, setAppName] = useState("");
  const [manifestXml, setManifestXml] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appName: appName.trim() || "Untitled app",
          manifestXml,
          privacyPolicy,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Failed to analyze. Please try again.");
      }

      const data = (await res.json()) as ApiResponse;
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  const currentRiskScore = result?.analysis.riskScore ?? 0;
  const clampedScore = Math.max(0, Math.min(100, currentRiskScore));

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleAnalyze}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)] sm:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <label className="block text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              App name
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-black/40 px-3 py-2 text-sm text-zinc-50 outline-none ring-0 focus:border-emerald-500 focus:bg-black/60"
              placeholder="e.g., SuperChat Messenger"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !manifestXml || !privacyPolicy}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isLoading ? "Analyzing…" : "Analyze risk"}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              AndroidManifest.xml
            </label>
            <textarea
              className="mt-1 h-44 w-full resize-y rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-xs text-zinc-50 outline-none ring-0 focus:border-emerald-500 focus:bg-black/60"
              placeholder="Paste the manifest XML here, including the <uses-permission> tags."
              value={manifestXml}
              onChange={(e) => setManifestXml(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              Privacy policy text
            </label>
            <textarea
              className="mt-1 h-44 w-full resize-y rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-xs text-zinc-50 outline-none ring-0 focus:border-emerald-500 focus:bg-black/60"
              placeholder="Paste the plain-text privacy policy or key sections here."
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-rose-400" role="alert">
            {error}
          </p>
        )}
      </form>

      {result && (
        <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-200 shadow-[0_18px_50px_rgba(0,0,0,0.55)] sm:p-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Risk score</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-semibold">{clampedScore}</span>
                <span className="text-xs text-zinc-400">/ 100 • {riskLabel(result.analysis.riskLevel)}</span>
              </div>
            </div>

            <div className="w-full max-w-xs">
              <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full ${riskColor(result.analysis.riskLevel)} transition-all`}
                  style={{ width: `${clampedScore}%` }}
                />
              </div>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Plain‑English verdict
              </p>
              <h3 className="text-sm font-semibold text-zinc-50">{result.analysis.headline}</h3>
              <p className="text-sm text-zinc-300">{result.analysis.summary}</p>
            </div>

            <div className="space-y-2 rounded-xl border border-zinc-800 bg-black/40 p-3 text-xs text-zinc-300">
              <p className="font-medium text-zinc-200">Permission hot‑spots</p>
              {result.dangerousPermissionLabels.length > 0 ? (
                <ul className="flex flex-wrap gap-1">
                  {result.dangerousPermissionLabels.map((label) => (
                    <li
                      key={label}
                      className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-300 ring-1 ring-rose-500/40"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-zinc-500">No obviously sensitive permissions detected.</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                How your data is used
              </p>
              <p className="text-sm text-zinc-300">{result.analysis.policySummary}</p>
            </div>

            <div className="space-y-1 rounded-xl border border-zinc-800 bg-black/40 p-3 text-xs text-zinc-300">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">What to do next</p>
              <p>{result.analysis.actionRecommendation}</p>
            </div>
          </div>

          <details className="group mt-1 text-xs text-zinc-400">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-xs text-zinc-500 transition group-open:text-zinc-300">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-700 text-[10px] text-zinc-300">
                i
              </span>
              <span>Show raw permissions and AI rationale</span>
            </summary>
            <div className="mt-3 space-y-2 rounded-xl border border-zinc-800 bg-black/40 p-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">Raw permissions</p>
                {result.permissions.length > 0 ? (
                  <ul className="mt-1 grid gap-1 text-[11px] text-zinc-300 sm:grid-cols-2">
                    {result.permissions.map((perm) => (
                      <li key={perm} className="truncate rounded bg-zinc-900/70 px-2 py-1 text-[11px]">
                        {perm}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-zinc-500">No permissions extracted from the manifest.</p>
                )}
              </div>

              <div>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  AI rationale
                </p>
                <p className="mt-1 text-[11px] text-zinc-300">{result.analysis.permissionsOverview}</p>
              </div>
            </div>
          </details>
        </section>
      )}
    </div>
  );
}

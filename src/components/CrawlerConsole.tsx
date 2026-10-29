import React, { useState } from 'react';
import { Play, Terminal, Shield, CheckCircle, Clock, Globe, Database, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';

export interface CrawlerRunItem {
  id: string;
  source: string;
  targetQuery: string;
  targetLocation: string;
  minSalary: number;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string;
  itemsFound: number;
  newVacanciesAdded: number;
  logs: string[];
}

interface CrawlerConsoleProps {
  runs: CrawlerRunItem[];
  onTriggerCrawl: (params: {
    sourceType: 'adzuna_api' | 'reed_api' | 'playwright_ats' | 'indeed_crawler';
    query: string;
    location: string;
    minSalary: number;
    customUrl?: string;
  }) => Promise<void>;
  isLoading: boolean;
  onRefresh: () => void;
  targetTitles?: string[];
  primarySkills?: string[];
}

export const CrawlerConsole: React.FC<CrawlerConsoleProps> = ({
  runs,
  onTriggerCrawl,
  isLoading,
  onRefresh,
  targetTitles = [],
  primarySkills = [],
}) => {
  const [sourceType, setSourceType] = useState<'playwright_ats' | 'adzuna_api' | 'reed_api' | 'indeed_crawler'>('playwright_ats');
  const [query, setQuery] = useState('Senior Full Stack Engineer TypeScript');
  const [location, setLocation] = useState('London / Remote UK');
  const [minSalary, setMinSalary] = useState(75000);
  const [customUrl, setCustomUrl] = useState('');
  const [selectedRunId, setSelectedRunId] = useState<string | null>(runs[0]?.id || null);

  const activeRun = runs.find(r => r.id === (selectedRunId || runs[0]?.id)) || runs[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onTriggerCrawl({
      sourceType,
      query,
      location,
      minSalary,
      customUrl: customUrl.trim() || undefined,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-display">
            Playwright & API Trawling Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Safe multi-source ingestion: Official UK APIs + Playwright headless browser workers for direct employer ATS boards.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Runs</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Crawler Configuration Launcher */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-sky-400 fill-current" />
              <span>Configure & Launch Trawl</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Target Source Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Target Sourcing Channel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSourceType('playwright_ats')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      sourceType === 'playwright_ats'
                        ? 'border-sky-500/80 bg-sky-950/20 text-sky-300 font-medium'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white">Playwright ATS</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Greenhouse, Lever, Direct</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceType('adzuna_api')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      sourceType === 'adzuna_api'
                        ? 'border-sky-500/80 bg-sky-950/20 text-sky-300 font-medium'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white">Adzuna UK API</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">UK salary index & regions</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceType('reed_api')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      sourceType === 'reed_api'
                        ? 'border-sky-500/80 bg-sky-950/20 text-sky-300 font-medium'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white">Reed UK API</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">British English tech specs</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceType('indeed_crawler')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      sourceType === 'indeed_crawler'
                        ? 'border-sky-500/80 bg-sky-950/20 text-sky-300 font-medium'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white">Indeed UK</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Broad market aggregator</div>
                  </button>
                </div>
              </div>

              {/* Search Query */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Role Title / Tech Skills Keywords
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer TypeScript"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  required
                />
                {(targetTitles.length > 0 || primarySkills.length > 0) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="text-slate-500">Quick fill:</span>
                    {targetTitles.slice(0, 3).map((t, idx) => (
                      <button
                        key={`title-${idx}`}
                        type="button"
                        onClick={() => setQuery(t)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-slate-800 transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                    {primarySkills.slice(0, 3).map((s, idx) => (
                      <button
                        key={`skill-${idx}`}
                        type="button"
                        onClick={() => setQuery(prev => prev ? `${prev} ${s}` : s)}
                        className="bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30 transition-colors font-mono"
                      >
                        +{s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location & Commute */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  UK Location Filter (Commute Radius)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. London / Reading / Remote UK"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              {/* Minimum Salary Floor */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-medium">Salary Floor (£ GBP)</label>
                  <span className="font-mono text-sky-400 font-semibold tabular-nums">
                    £{minSalary.toLocaleString()} / year
                  </span>
                </div>
                <input
                  type="range"
                  min="40000"
                  max="140000"
                  step="5000"
                  value={minSalary}
                  onChange={e => setMinSalary(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>£40k</span>
                  <span>£75k (Candidate Floor)</span>
                  <span>£140k</span>
                </div>
              </div>

              {/* Optional Custom ATS Board URL */}
              {sourceType === 'playwright_ats' && (
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="block text-slate-300 font-medium mb-1">
                    Direct Employer ATS URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    placeholder="https://boards.greenhouse.io/... or https://jobs.lever.co/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono text-[11px]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Playwright stealth worker navigates and parses DOM directly.
                  </span>
                </div>
              )}

              {/* Safe Sourcing Policy Confirmation */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Enforced Guardrails (TS v0.2 Spec)</span>
                </div>
                <p>
                  • Zero scraping from candidate's personal LinkedIn account.<br />
                  • CAPTCHA challenge forms are automatically skipped, never bypassed.<br />
                  • Cross-agency deduplication applied to all vacancies.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Executing Stealth Trawler...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Ingestion Worker</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Terminal Logs & Past Runs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Log Terminal */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono font-medium text-slate-300">
                  Crawler Terminal Output & Execution Telemetry
                </span>
              </div>
              {activeRun && (
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="text-slate-400">ID: {activeRun.id}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className={`capitalize ${activeRun.status === 'completed' ? 'text-emerald-400' : activeRun.status === 'running' ? 'text-sky-400' : 'text-rose-400'}`}>
                    {activeRun.status}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1.5 bg-slate-950/90">
              {activeRun ? (
                activeRun.logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed">
                    <span className="text-slate-500">{log.slice(0, 10)}</span>{' '}
                    <span className={log.includes('error') || log.includes('CAPTCHA') ? 'text-amber-400' : log.includes('Deduplication') || log.includes('passed') ? 'text-emerald-400' : 'text-slate-300'}>
                      {log.slice(10)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center text-slate-500">
                  No crawler execution logs available. Launch a worker above to begin.
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Items Located: {activeRun?.itemsFound || 0}</span>
              <span>New Vacancies Saved: {activeRun?.newVacanciesAdded || 0}</span>
              <span>Runtime: ~3.2s</span>
            </div>
          </div>

          {/* Past Crawler Runs Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Ingestion Run History
            </h3>

            <div className="space-y-2">
              {runs.map(run => (
                <button
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-colors flex items-center justify-between text-xs ${
                    (selectedRunId === run.id || (!selectedRunId && runs[0]?.id === run.id))
                      ? 'border-sky-500/60 bg-slate-850 text-white'
                      : 'border-slate-800/80 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{run.source.toUpperCase()}</span>
                      <span className="text-slate-500 font-mono">{run.id}</span>
                      <span className="text-slate-400 font-mono">£{run.minSalary.toLocaleString()}+</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Query: "{run.targetQuery}" · {run.targetLocation}
                    </div>
                  </div>

                  <div className="text-right font-mono shrink-0">
                    <div className="text-emerald-400 font-medium">+{run.newVacanciesAdded} added</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(run.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

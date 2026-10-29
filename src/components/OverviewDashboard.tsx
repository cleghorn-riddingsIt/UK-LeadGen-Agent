import React from 'react';
import { Calendar, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, Mail, Zap, ExternalLink, ArrowRight, UserCheck } from 'lucide-react';

interface StatsData {
  primaryKpi: {
    metric: string;
    currentValue: number;
    targetBaseline: string;
    status: string;
  };
  funnel: {
    vacanciesFound: number;
    relevantMatched: number;
    applicationsSent: number;
    recruiterReplies: number;
    meetingsBooked: number;
  };
  deliverability: {
    sentToday: number;
    dailyCap: number;
    bounceRate: number;
    maxBounceThreshold: number;
    domainReputation: string;
  };
  atsScreening: {
    preSendAtsPassRate: number;
    targetThreshold: number;
    cleanParseScore: number;
  };
  latencyP95Seconds: number;
}

interface OverviewDashboardProps {
  stats: StatsData | null;
  onNavigateTab: (tab: 'vacancies' | 'crawlers' | 'handoffs' | 'factbank') => void;
  onOpenCrawlerModal: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  onNavigateTab,
  onOpenCrawlerModal,
}) => {
  if (!stats) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full mb-3" />
        <p className="text-sm text-slate-400">Loading pipeline telemetry...</p>
      </div>
    );
  }

  const { funnel, primaryKpi, deliverability, atsScreening } = stats;
  const replyRate = funnel.applicationsSent > 0 ? Math.round((funnel.recruiterReplies / funnel.applicationsSent) * 100) : 0;
  const meetingConversion = funnel.applicationsSent > 0 ? Math.round((funnel.meetingsBooked / funnel.applicationsSent) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Primary KPI Hero Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <span>TS v0.2 Technical Specification</span>
              <span aria-hidden="true">·</span>
              <span>United Kingdom Primary Market</span>
              <span aria-hidden="true">·</span>
              <span>Zero-Touch Candidate Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
              Autonomous Job Acquisition & Lead Funnel
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Finds UK remote and hybrid vacancies daily, filters by £75k+ salary floor and verified technical competencies, tailors verifiable fact-traced CVs, and routes employer replies directly to Telegram.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-5 flex flex-col justify-center min-w-[260px] shrink-0">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Primary System KPI
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {primaryKpi.currentValue}
              </span>
              <span className="text-xs text-slate-400">
                meetings / week (target: {primaryKpi.targetBaseline})
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Candidate involvement:</span>
              <span className="text-emerald-400 font-medium">Zero-touch (Interviews only)</span>
            </div>
          </div>
        </div>

        {/* Conversion Funnel Strip */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Conversion Funnel Velocity
            </h2>
            <span className="text-xs text-slate-400">
              Precision matching protects candidate Gmail reputation
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
              <div className="text-[11px] text-slate-400">1. Vacancies Found</div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
                {funnel.vacanciesFound}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Adzuna, Reed, ATS</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
              <div className="text-[11px] text-slate-400">2. Relevant Matched</div>
              <div className="text-2xl font-bold font-mono text-sky-400 tabular-nums mt-1">
                {funnel.relevantMatched}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Passed salary & skills</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
              <div className="text-[11px] text-slate-400">3. Applications Sent</div>
              <div className="text-2xl font-bold font-mono text-indigo-400 tabular-nums mt-1">
                {funnel.applicationsSent}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">ATS Verified CVs</div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
              <div className="text-[11px] text-slate-400">4. Recruiter Replies</div>
              <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
                {funnel.recruiterReplies}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1 tabular-nums">
                {replyRate}% reply rate (spec ≥10%)
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3.5">
              <div className="text-[11px] text-emerald-300 font-medium">5. Meetings Initiated</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
                {funnel.meetingsBooked}
              </div>
              <div className="text-[11px] text-emerald-400/90 font-mono mt-1 tabular-nums">
                {meetingConversion}% conversion (spec 3–5%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Guardrails & System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deliverability & Gmail Guard */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold text-white">Gmail Deliverability Guard</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">Warm & Protected</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Daily ramp-up dispatch:</span>
                <span className="font-mono text-white tabular-nums">
                  {deliverability.sentToday} / {deliverability.dailyCap} emails
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (deliverability.sentToday / deliverability.dailyCap) * 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Bounce rate:</span>
              <span className="font-mono text-emerald-400 tabular-nums">
                {deliverability.bounceRate}% (auto-pause &gt; {deliverability.maxBounceThreshold}%)
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Sending mailbox:</span>
              <span className="text-slate-300 font-mono text-[11px]">candidate's own Gmail</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>PECR & GDPR opt-out:</span>
              <span className="text-emerald-400">Enforced in footer</span>
            </div>
          </div>
        </div>

        {/* ATS Simulation Health */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">ATS Simulation Engine</h3>
            </div>
            <span className="text-xs text-sky-400 font-mono">Passing ≥85%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Pre-send ATS match pass rate:</span>
                <span className="font-mono text-emerald-400 tabular-nums">
                  {atsScreening.preSendAtsPassRate}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${atsScreening.preSendAtsPassRate}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Clean parse guarantee:</span>
              <span className="font-mono text-emerald-400 tabular-nums">{atsScreening.cleanParseScore}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Format & Length:</span>
              <span className="text-slate-300">British English · ≤2 Pages</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Truthful claim verification:</span>
              <span className="text-emerald-400">100% Fact-ID Traced</span>
            </div>
          </div>
        </div>

        {/* Safe Sourcing & Latency */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Sourcing & SLA Guardrails</h3>
            </div>
            <span className="text-xs text-emerald-400 font-mono">p95 ≤ 5 min</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Candidate Telegram handoff:</span>
              <span className="font-mono text-emerald-400 tabular-nums">
                {Math.round(stats.latencyP95Seconds / 60)}m {stats.latencyP95Seconds % 60}s SLA
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>Safe sourcing protocol:</span>
              <span className="text-slate-300">No candidate LinkedIn scrape</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>CAPTCHA forms:</span>
              <span className="text-amber-400">Skipped (never bypassed)</span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400">
              <span>Djinni / Email routing:</span>
              <span className="text-slate-300">Unified inbox ingestion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operator Quick Action Strip */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Daily Orchestrator Status</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            8 autonomous agent routines active under orchestrator. Technical alerts route directly to Operator.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('vacancies')}
            className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Review Vacancy Queue
          </button>
          <button
            onClick={onOpenCrawlerModal}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Trigger Next Trawl</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

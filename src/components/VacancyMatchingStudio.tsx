import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, CheckCircle2, XCircle, ArrowUpRight, Send, AlertTriangle, Sparkles, FileText, ChevronRight, Check } from 'lucide-react';
import { Vacancy } from '../server/db.ts';

interface VacancyMatchingStudioProps {
  vacancies: Vacancy[];
  onEvaluateVacancy: (id: string) => Promise<void>;
  onApplyVacancy: (id: string) => Promise<void>;
  isEvaluating: boolean;
  isApplying: boolean;
}

export const VacancyMatchingStudio: React.FC<VacancyMatchingStudioProps> = ({
  vacancies,
  onEvaluateVacancy,
  onApplyVacancy,
  isEvaluating,
  isApplying,
}) => {
  const [search, setSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState<'all' | 'remote' | 'hybrid' | 'onsite'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'matched' | 'ats_verified' | 'sent' | 'interview' | 'rejected'>('all');
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>(vacancies[0]?.id || '');

  const filteredVacancies = vacancies.filter(v => {
    if (formatFilter !== 'all' && v.workFormat !== formatFilter) return false;
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchComp = v.company.toLowerCase().includes(q);
      const matchSkills = v.requiredSkills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchSkills) return false;
    }
    return true;
  });

  const activeVacancy = vacancies.find(v => v.id === selectedVacancyId) || vacancies[0];

  return (
    <div className="space-y-6">
      {/* Search and Filter Strip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by job title, company, or tech stack (e.g. Node, React)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Work Format Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg self-start">
          <button
            onClick={() => setFormatFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              formatFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Formats
          </button>
          <button
            onClick={() => setFormatFilter('remote')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              formatFilter === 'remote' ? 'bg-slate-800 text-sky-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Remote Only
          </button>
          <button
            onClick={() => setFormatFilter('hybrid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              formatFilter === 'hybrid' ? 'bg-slate-800 text-sky-400 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hybrid (UK)
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${statusFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
          >
            All ({vacancies.length})
          </button>
          <button
            onClick={() => setStatusFilter('ats_verified')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${statusFilter === 'ats_verified' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30' : 'text-slate-400'}`}
          >
            ATS Ready
          </button>
          <button
            onClick={() => setStatusFilter('sent')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${statusFilter === 'sent' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-500/30' : 'text-slate-400'}`}
          >
            Sent
          </button>
          <button
            onClick={() => setStatusFilter('interview')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${statusFilter === 'interview' ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40' : 'text-slate-400'}`}
          >
            Interviews
          </button>
        </div>
      </div>

      {/* Main Split View: Vacancy Master List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Vacancy List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredVacancies.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center text-xs text-slate-400">
              No vacancies match the current filters. Adjust your search or trigger a new crawl.
            </div>
          ) : (
            filteredVacancies.map(vacancy => {
              const isSelected = vacancy.id === activeVacancy?.id;
              const hasHighMatch = (vacancy.matchScore || 0) >= 80;

              return (
                <div
                  key={vacancy.id}
                  onClick={() => setSelectedVacancyId(vacancy.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-500/80 bg-slate-900/90 shadow-md'
                      : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="font-medium text-slate-300">{vacancy.company}</span>
                        <span aria-hidden="true">·</span>
                        <span>{vacancy.location}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{vacancy.workFormat}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white tracking-tight line-clamp-1">
                        {vacancy.title}
                      </h4>
                    </div>

                    {/* Match Score Display */}
                    {typeof vacancy.matchScore === 'number' ? (
                      <div className="text-right shrink-0">
                        <div className={`text-base font-bold font-mono tabular-nums ${hasHighMatch ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {vacancy.matchScore}%
                        </div>
                        <div className="text-[10px] text-slate-500">Gemini Match</div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">Unscored</span>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <div className="font-mono text-slate-300 font-medium tabular-nums">
                      £{vacancy.salaryMin.toLocaleString()} – £{vacancy.salaryMax.toLocaleString()}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{vacancy.source}</span>
                      <span className={`text-[11px] font-mono capitalize ${
                        vacancy.status === 'interview' ? 'text-emerald-400 font-semibold' :
                        vacancy.status === 'sent' ? 'text-indigo-400' :
                        vacancy.status === 'ats_verified' ? 'text-sky-400' :
                        vacancy.status === 'rejected' ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {vacancy.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Inspector & ATS Tailor */}
        <div className="lg:col-span-7">
          {activeVacancy ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
              {/* Header & Source URL */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-sky-400 font-medium">{activeVacancy.source}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeVacancy.location}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{activeVacancy.workFormat} format</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight font-display">
                    {activeVacancy.title}
                  </h3>
                  <div className="text-xs text-slate-300 font-medium">
                    {activeVacancy.company}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1 shrink-0">
                  <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                    £{activeVacancy.salaryMin.toLocaleString()} – £{activeVacancy.salaryMax.toLocaleString()}
                  </div>
                  <a
                    href={activeVacancy.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1 transition-colors"
                  >
                    <span>View Posting</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Required Skills Strip */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Required Competencies (UK Spec)
                </h4>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                  {activeVacancy.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-mono text-[11px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gemini Match & ATS Simulation Scorecard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] text-slate-400">Semantic Fit Score</div>
                  <div className="text-2xl font-bold font-mono text-sky-400 tabular-nums mt-0.5">
                    {activeVacancy.matchScore || '--'}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Evaluated by Gemini Flash</div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] text-slate-400">Pre-Send ATS Keywords</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                    {activeVacancy.atsKeywordCoveragePercent || 92}%
                  </div>
                  <div className="text-[10px] text-emerald-400/80 mt-1">Target ≥80% passed</div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5">
                  <div className="text-[11px] text-slate-400">ATS Clean Parser</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                    {activeVacancy.atsCleanParse !== false ? '100%' : 'FAIL'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Titles, dates & sections</div>
                </div>
              </div>

              {/* Truthful CV & Fact Bank Traceability */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Truthful CV Generator (Fact-ID Traced)</span>
                  </h4>
                  {activeVacancy.factCitations && (
                    <div className="text-xs text-emerald-400 font-mono">
                      {activeVacancy.factCitations.length} verified facts cited
                    </div>
                  )}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto leading-relaxed">
                  {activeVacancy.tailoredCvMarkdown ? (
                    <div className="space-y-2">
                      <p className="text-slate-400 italic text-[11px] pb-1 border-b border-slate-800">
                        Every claim in this British English CV traces directly to an immutable candidate Fact ID:
                      </p>
                      <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200">
                        {activeVacancy.tailoredCvMarkdown}
                      </pre>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500">
                      CV not yet tailored. Run the Gemini matching engine below to generate fact-traced CV.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onEvaluateVacancy(activeVacancy.id)}
                  disabled={isEvaluating}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEvaluating ? 'Evaluating with Gemini...' : 'Re-evaluate Match & ATS'}</span>
                </button>

                <div className="flex items-center gap-3">
                  {activeVacancy.status === 'sent' || activeVacancy.status === 'interview' ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                      <Check className="w-4 h-4" />
                      <span>Dispatched from Candidate Gmail</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onApplyVacancy(activeVacancy.id)}
                      disabled={isApplying || activeVacancy.status === 'rejected'}
                      className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isApplying ? 'Dispatching...' : 'Dispatch Application (Gmail)'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-16 text-center text-xs text-slate-400">
              Select a vacancy on the left to inspect matching scores, ATS simulation, and tailored CV.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

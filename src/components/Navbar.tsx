import React from 'react';
import { Radar, Play, UserCheck, ShieldCheck, Send, Bell } from 'lucide-react';

export type ActiveTab = 'overview' | 'crawlers' | 'vacancies' | 'factbank' | 'handoffs';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCrawlerModal: () => void;
  pendingHandoffCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCrawlerModal,
  pendingHandoffCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Radar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white font-display">
              UK LeadGen Agent
            </span>
            <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
              TS v0.2 Operator Console
            </span>
          </div>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview'
                ? 'bg-slate-800/80 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Overview & Funnel
          </button>

          <button
            onClick={() => setActiveTab('crawlers')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'crawlers'
                ? 'bg-slate-800/80 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Playwright & API Trawlers
          </button>

          <button
            onClick={() => setActiveTab('vacancies')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'vacancies'
                ? 'bg-slate-800/80 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Vacancy Matching & ATS
          </button>

          <button
            onClick={() => setActiveTab('factbank')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'factbank'
                ? 'bg-slate-800/80 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Candidate Fact Bank
          </button>

          <button
            onClick={() => setActiveTab('handoffs')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 relative ${
              activeTab === 'handoffs'
                ? 'bg-slate-800/80 text-sky-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Intent Handoffs
            {pendingHandoffCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                {pendingHandoffCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCrawlerModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 rounded-lg hover:bg-sky-300 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Trawler</span>
          </button>
        </div>
      </div>

      {/* Mobile subnavigation bar */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-800/60 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('crawlers')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'crawlers' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'}`}
        >
          Trawlers
        </button>
        <button
          onClick={() => setActiveTab('vacancies')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'vacancies' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'}`}
        >
          Vacancies
        </button>
        <button
          onClick={() => setActiveTab('factbank')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'factbank' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'}`}
        >
          Fact Bank
        </button>
        <button
          onClick={() => setActiveTab('handoffs')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'handoffs' ? 'bg-slate-800 text-sky-400' : 'text-slate-400'}`}
        >
          Handoffs ({pendingHandoffCount})
        </button>
      </div>
    </header>
  );
};

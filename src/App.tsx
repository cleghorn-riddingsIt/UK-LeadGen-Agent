import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar.tsx';
import { OverviewDashboard } from './components/OverviewDashboard.tsx';
import { CrawlerConsole, CrawlerRunItem } from './components/CrawlerConsole.tsx';
import { VacancyMatchingStudio } from './components/VacancyMatchingStudio.tsx';
import { FactBankStudio } from './components/FactBankStudio.tsx';
import { HandoffConsole } from './components/HandoffConsole.tsx';
import { CandidateProfile, CandidateFact, Vacancy, HandoffEvent } from './server/db.ts';
import { Check, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [runs, setRuns] = useState<CrawlerRunItem[]>([]);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [facts, setFacts] = useState<CandidateFact[]>([]);
  const [handoffs, setHandoffs] = useState<HandoffEvent[]>([]);

  // Action states
  const [isCrawling, setIsCrawling] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAllData = async () => {
    try {
      const [statsRes, vacRes, runsRes, profRes, handoffsRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()),
        fetch('/api/vacancies').then(r => r.json()),
        fetch('/api/crawlers/runs').then(r => r.json()),
        fetch('/api/profile').then(r => r.json()),
        fetch('/api/handoffs').then(r => r.json()),
      ]);

      setStats(statsRes);
      setVacancies(vacRes);
      setRuns(runsRes);
      setProfile(profRes.profile);
      setFacts(profRes.facts);
      setHandoffs(handoffsRes);
    } catch (err) {
      console.error('Failed to load system state:', err);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerCrawl = async (params: {
    sourceType: 'adzuna_api' | 'reed_api' | 'playwright_ats' | 'indeed_crawler';
    query: string;
    location: string;
    minSalary: number;
    customUrl?: string;
  }) => {
    setIsCrawling(true);
    try {
      const res = await fetch('/api/vacancies/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      await loadAllData();
      showToast(`Trawl finished: +${data.newVacanciesAdded} new unique UK vacancies indexed.`);
      setActiveTab('vacancies');
    } catch (err: any) {
      showToast(`Crawl error: ${err.message}`);
    } finally {
      setIsCrawling(false);
    }
  };

  const handleEvaluateVacancy = async (id: string) => {
    setIsEvaluating(true);
    try {
      const res = await fetch(`/api/vacancies/${id}/evaluate`, { method: 'POST' });
      const data = await res.json();
      await loadAllData();
      showToast(`Evaluated: ${data.evaluation.matchScore}% Match · Pre-send ATS: ${data.evaluation.atsScore}%`);
    } catch (err: any) {
      showToast(`Evaluation failed: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApplyVacancy = async (id: string) => {
    setIsApplying(true);
    try {
      const res = await fetch(`/api/vacancies/${id}/apply`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await loadAllData();
      showToast(data.message || 'Application successfully dispatched via candidate Gmail!');
    } catch (err: any) {
      showToast(err.message || 'Application dispatch capped.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleAddFact = async (newFact: any) => {
    try {
      const res = await fetch('/api/facts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFact),
      });
      if (res.ok) {
        await loadAllData();
        showToast('New verified fact appended to candidate Fact Bank.');
      }
    } catch (err: any) {
      showToast(`Failed to add fact: ${err.message}`);
    }
  };

  const handleDeleteFact = async (id: string) => {
    try {
      await fetch(`/api/facts/${id}`, { method: 'DELETE' });
      await loadAllData();
      showToast(`Fact ${id} removed.`);
    } catch (err: any) {
      showToast(`Failed to remove fact: ${err.message}`);
    }
  };

  const handleUpdateProfile = async (updated: Partial<CandidateProfile>) => {
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      await loadAllData();
      showToast('Candidate profile constraints updated.');
    } catch (err: any) {
      showToast(`Failed to update profile: ${err.message}`);
    }
  };

  const handleSimulateInbound = async (payload: any) => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/handoffs/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      await loadAllData();
      showToast(`Inbound message parsed as ${data.intentType.replace('_', ' ').toUpperCase()} · Telegram alert sent!`);
      setActiveTab('handoffs');
    } catch (err: any) {
      showToast(`Simulation failed: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleUpdateHandoffStatus = async (id: string, status: any) => {
    try {
      await fetch(`/api/handoffs/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await loadAllData();
      showToast('Candidate takeover confirmed. Automation on thread remains frozen.');
    } catch (err: any) {
      showToast(`Status update error: ${err.message}`);
    }
  };

  const pendingHandoffCount = handoffs.filter(h => h.candidateStatus === 'pending_takeover').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* 3-Zone Top Navigation Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCrawlerModal={() => setActiveTab('crawlers')}
        pendingHandoffCount={pendingHandoffCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <OverviewDashboard
            stats={stats}
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenCrawlerModal={() => setActiveTab('crawlers')}
          />
        )}

        {activeTab === 'crawlers' && (
          <CrawlerConsole
            runs={runs}
            onTriggerCrawl={handleTriggerCrawl}
            isLoading={isCrawling}
            onRefresh={loadAllData}
            targetTitles={profile?.targetTitles}
            primarySkills={profile?.primarySkills}
          />
        )}

        {activeTab === 'vacancies' && (
          <VacancyMatchingStudio
            vacancies={vacancies}
            onEvaluateVacancy={handleEvaluateVacancy}
            onApplyVacancy={handleApplyVacancy}
            isEvaluating={isEvaluating}
            isApplying={isApplying}
          />
        )}

        {activeTab === 'factbank' && (
          <FactBankStudio
            profile={profile}
            facts={facts}
            onAddFact={handleAddFact}
            onDeleteFact={handleDeleteFact}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'handoffs' && (
          <HandoffConsole
            handoffs={handoffs}
            onSimulateInbound={handleSimulateInbound}
            onUpdateStatus={handleUpdateHandoffStatus}
            isSimulating={isSimulating}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">AI Job Lead Generation Agent</span>
            <span aria-hidden="true">·</span>
            <span>UK Technical Specification TS v0.2</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Touch Architecture</span>
          </div>
          <div className="text-slate-400">
            Automated crawlers & ATS verification running on Node.js + Playwright stealth engine.
          </div>
        </div>
      </footer>

      {/* Real-time Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-sky-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

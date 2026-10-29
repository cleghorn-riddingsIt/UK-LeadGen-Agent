import React, { useState } from 'react';
import { Send, PhoneCall, CheckCircle2, Clock, AlertTriangle, ShieldAlert, MessageSquare, ExternalLink, UserCheck, Bot } from 'lucide-react';
import { HandoffEvent } from '../server/db.ts';

interface HandoffConsoleProps {
  handoffs: HandoffEvent[];
  onSimulateInbound: (payload: {
    emailBody: string;
    company: string;
    roleTitle: string;
    recruiterName: string;
  }) => Promise<void>;
  onUpdateStatus: (id: string, status: 'pending_takeover' | 'candidate_engaged' | 'call_logged') => Promise<void>;
  isSimulating: boolean;
}

export const HandoffConsole: React.FC<HandoffConsoleProps> = ({
  handoffs,
  onSimulateInbound,
  onUpdateStatus,
  isSimulating,
}) => {
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedHandoffId, setSelectedHandoffId] = useState<string>(handoffs[0]?.id || '');

  // Simulation form state
  const [simCompany, setSimCompany] = useState('Deliveroo Engineering');
  const [simRole, setSimRole] = useState('Senior Full Stack Systems Engineer');
  const [simRecruiter, setSimRecruiter] = useState('Sarah Jenkins (Engineering Talent Partner)');
  const [simBody, setSimBody] = useState(
    "Hi Alex, We reviewed your application and were impressed by your Node.js and PostgreSQL high-throughput pipeline experience (FACT-001). We would love to invite you for a 30-minute introductory call with our engineering director next Tuesday. Please select a time that suits you best here: https://calendly.com/deliveroo-talent/alex-intro"
  );

  // Phone Call Logger state
  const [callCompany, setCallCompany] = useState('Wise');
  const [callRecruiter, setCallRecruiter] = useState('David Miller');
  const [callNotes, setCallNotes] = useState('Called regarding Lead Platform role (£105k). Agreed to first technical screening on Friday 10am.');

  const activeHandoff = handoffs.find(h => h.id === selectedHandoffId) || handoffs[0];

  const handleSimulateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSimulateInbound({
      company: simCompany,
      roleTitle: simRole,
      recruiterName: simRecruiter,
      emailBody: simBody,
    });
    setShowSimulateModal(false);
  };

  const handleLogCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSimulateInbound({
      company: callCompany,
      roleTitle: 'Direct Inbound Recruiter Call',
      recruiterName: callRecruiter,
      emailBody: `[PHONE CALL LOGGED BY CANDIDATE]: ${callNotes}`,
    });
    setShowCallModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Zero-Touch Protocol Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>Zero-Touch Candidate Protocol</span>
              <span aria-hidden="true">·</span>
              <span>Telegram Bot Interface</span>
              <span aria-hidden="true">·</span>
              <span>p95 Latency ≤ 5 min</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">
              Employer Intent & Candidate Handoff Monitor
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl">
              The candidate is never bothered by rejections, auto-replies, or application status updates. Only when an employer expresses actionable intent (interview, scheduling link, test task) does the system freeze automation on the thread and dispatch an instant Telegram alert.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowCallModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
              <span>Log Phone Call (1 Step)</span>
            </button>

            <button
              onClick={() => setShowSimulateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-sm"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Simulate Inbound Email</span>
            </button>
          </div>
        </div>

        {/* SLA & Automation Guard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs font-mono">
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
            <span className="text-slate-400">Handoff SLA latency:</span>
            <span className="text-emerald-400 font-bold tabular-nums">2m 22s (target ≤5m)</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
            <span className="text-slate-400">Active frozen threads:</span>
            <span className="text-sky-400 font-bold tabular-nums">{handoffs.length} threads</span>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
            <span className="text-slate-400">Telegram Bot dispatch:</span>
            <span className="text-emerald-400 font-bold">@alex_morrison_bot</span>
          </div>
        </div>
      </div>

      {/* Main Split: Handoff Events List + Telegram Payload Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Events List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Inbound Intent Queue ({handoffs.length})
          </h3>

          {handoffs.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center text-xs text-slate-400">
              No employer handoffs yet. Click "Simulate Inbound Email" to test the classifier.
            </div>
          ) : (
            handoffs.map(h => {
              const isSelected = h.id === activeHandoff?.id;
              const isPending = h.candidateStatus === 'pending_takeover';

              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedHandoffId(h.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-sky-500/80 bg-slate-900/90 shadow-md'
                      : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span className="font-semibold text-white">{h.company}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">{h.recruiterName}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                        {h.roleTitle}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase shrink-0 ${
                      h.intentType === 'scheduling_link' || h.intentType === 'interview_invitation'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {h.intentType.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    "{h.employerMessage}"
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Latency: {h.latencySeconds}s</span>
                    <span className={isPending ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                      {isPending ? 'Takeover Required' : 'Candidate Engaged'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Telegram Live Alert & Context Viewer */}
        <div className="lg:col-span-7">
          {activeHandoff ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
              {/* Telegram Alert Box */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-white">
                      <Send className="w-3 h-3 -rotate-45" />
                    </div>
                    <span className="text-xs font-semibold text-slate-200">
                      Telegram Alert Dispatch (Candidate Bot)
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono">
                    Delivered in {activeHandoff.latencySeconds}s
                  </span>
                </div>

                <div className="bg-slate-950 border border-sky-500/30 rounded-xl p-5 space-y-3 font-mono text-xs text-slate-200 shadow-xl">
                  <div className="text-sm font-bold text-sky-400 font-sans">
                    {activeHandoff.telegramPayload.alertTitle}
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
                    {activeHandoff.telegramPayload.bodyMarkdown}
                  </pre>

                  {/* Telegram Mock Buttons */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 font-sans">
                    {activeHandoff.telegramPayload.actionButtons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => onUpdateStatus(activeHandoff.id, 'candidate_engaged')}
                        className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-medium transition-colors"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Employer Message */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Raw Employer Communication
                </h4>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 leading-relaxed font-mono">
                  {activeHandoff.employerMessage}
                </div>
              </div>

              {/* Status & Freeze Toggle */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Candidate status:</span>
                  <span className={`font-semibold capitalize ${activeHandoff.candidateStatus === 'candidate_engaged' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {activeHandoff.candidateStatus.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeHandoff.candidateStatus === 'pending_takeover' ? (
                    <button
                      onClick={() => onUpdateStatus(activeHandoff.id, 'candidate_engaged')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      Confirm Candidate Takeover
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Candidate in Direct Contact with Employer</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-16 text-center text-xs text-slate-400">
              Select an inbound handoff event on the left to inspect Telegram payloads and recruiter message context.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Simulate Inbound Recruiter Email */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">
              Simulate Inbound Recruiter Message
            </h3>
            <p className="text-xs text-slate-400">
              Test how the Multi-Agent intent classifier parses recruiter replies, freezes thread automation, and generates instant Telegram notifications.
            </p>

            <form onSubmit={handleSimulateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company</label>
                  <input
                    type="text"
                    value={simCompany}
                    onChange={e => setSimCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Recruiter Name</label>
                  <input
                    type="text"
                    value={simRecruiter}
                    onChange={e => setSimRecruiter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Role Title</label>
                <input
                  type="text"
                  value={simRole}
                  onChange={e => setSimRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Inbound Email Text
                </label>
                <textarea
                  rows={4}
                  value={simBody}
                  onChange={e => setSimBody(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold rounded-lg"
                >
                  {isSimulating ? 'Classifying...' : 'Dispatch Simulated Response'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: One-Click Phone Call Logger */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">
              Log Recruiter Phone Call (One-Step)
            </h3>
            <p className="text-xs text-slate-400">
              Per TS v0.2 spec: Recruiter calls to candidate's phone are logged in the bot in one single step.
            </p>

            <form onSubmit={handleLogCallSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company</label>
                  <input
                    type="text"
                    value={callCompany}
                    onChange={e => setCallCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Recruiter Name</label>
                  <input
                    type="text"
                    value={callRecruiter}
                    onChange={e => setCallRecruiter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Call Summary & Next Action
                </label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCallModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg"
                >
                  Log Call & Freeze Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

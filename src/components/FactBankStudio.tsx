import React, { useState } from 'react';
import { ShieldCheck, Plus, CheckCircle, FileText, User, MapPin, DollarSign, Briefcase, Trash2, X, Tag, Settings, Save } from 'lucide-react';
import { CandidateProfile, CandidateFact } from '../server/db.ts';

interface FactBankStudioProps {
  profile: CandidateProfile | null;
  facts: CandidateFact[];
  onAddFact: (fact: {
    category: CandidateFact['category'];
    statement: string;
    proofDocument: string;
    technologies: string[];
  }) => Promise<void>;
  onDeleteFact: (id: string) => Promise<void>;
  onUpdateProfile: (updated: Partial<CandidateProfile>) => Promise<void>;
}

export const FactBankStudio: React.FC<FactBankStudioProps> = ({
  profile,
  facts,
  onAddFact,
  onDeleteFact,
  onUpdateProfile,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [statement, setStatement] = useState('');
  const [category, setCategory] = useState<CandidateFact['category']>('System Architecture');
  const [technologies, setTechnologies] = useState('TypeScript, Node.js, PostgreSQL');
  const [proofDocument, setProofDocument] = useState('Production commit logs & Reference endorsement');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile keywords & job types edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [targetTitles, setTargetTitles] = useState<string[]>(profile?.targetTitles || []);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [primarySkills, setPrimarySkills] = useState<string[]>(profile?.primarySkills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [salaryFloor, setSalaryFloor] = useState<number>(profile?.salaryFloorGbp || 75000);
  const [location, setLocation] = useState(profile?.location || 'London / Reading (Home Counties)');
  const [commuteRadius, setCommuteRadius] = useState(profile?.commuteRadiusMiles || 35);
  const [workFormats, setWorkFormats] = useState<('remote' | 'hybrid' | 'onsite')[]>(profile?.workFormats || ['remote', 'hybrid']);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddFact({
        category,
        statement: statement.trim(),
        proofDocument: proofDocument.trim(),
        technologies: technologies.split(',').map(s => s.trim()).filter(Boolean),
      });
      setStatement('');
      setShowAddModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTitle = () => {
    if (newTitleInput.trim() && !targetTitles.includes(newTitleInput.trim())) {
      setTargetTitles([...targetTitles, newTitleInput.trim()]);
      setNewTitleInput('');
    }
  };

  const handleRemoveTitle = (t: string) => {
    setTargetTitles(targetTitles.filter(item => item !== t));
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !primarySkills.includes(newSkillInput.trim())) {
      setPrimarySkills([...primarySkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (s: string) => {
    setPrimarySkills(primarySkills.filter(item => item !== s));
  };

  const toggleFormat = (fmt: 'remote' | 'hybrid' | 'onsite') => {
    if (workFormats.includes(fmt)) {
      if (workFormats.length > 1) {
        setWorkFormats(workFormats.filter(f => f !== fmt));
      }
    } else {
      setWorkFormats([...workFormats, fmt]);
    }
  };

  const handleSaveProfileSettings = async () => {
    setIsSavingProfile(true);
    try {
      await onUpdateProfile({
        targetTitles,
        primarySkills,
        salaryFloorGbp: Number(salaryFloor),
        location,
        commuteRadiusMiles: Number(commuteRadius),
        workFormats,
      });
      setIsEditingProfile(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-8">
      {/* Onboarding & Constraints Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <span>Candidate Matching Profile</span>
              <span aria-hidden="true">·</span>
              <span>Keywords & Job Types Settings</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight font-display">
              Candidate Profile & Targeting Parameters
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Configure target job roles, technical skill keywords, and salary floors. The trawler and semantic matching engine filter all UK vacancies against these criteria.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors border ${
                isEditingProfile
                  ? 'bg-sky-400 text-slate-950 border-sky-400 shadow-sm'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Close Editor' : 'Edit Keywords & Job Types'}</span>
            </button>
          </div>
        </div>

        {/* Profile Constraints 4-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Candidate Identity</span>
            </div>
            <div className="font-semibold text-white">{profile.name}</div>
            <div className="text-slate-400 text-[11px] font-mono">{profile.email}</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>Location & Commute</span>
            </div>
            <div className="font-semibold text-white">{profile.location}</div>
            <div className="text-slate-400 text-[11px]">{profile.commuteRadiusMiles} miles max commute</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hard Salary Floor</span>
            </div>
            <div className="font-semibold text-emerald-400 font-mono tabular-nums">
              £{profile.salaryFloorGbp.toLocaleString()} GBP
            </div>
            <div className="text-slate-400 text-[11px]">Hard filter · Drops &lt; floor</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-sky-400" />
              <span>Allowed Formats</span>
            </div>
            <div className="font-semibold text-white capitalize">{profile.workFormats.join(' & ')}</div>
            <div className="text-slate-400 text-[11px]">UK time zones only</div>
          </div>
        </div>

        {/* Interactive Keywords & Job Types Editor Panel */}
        {isEditingProfile ? (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Tag className="w-4 h-4 text-sky-400" />
                <span>Configure Target Job Types & Technical Skill Keywords</span>
              </h3>
              <span className="text-xs text-slate-400">
                Changes apply immediately to live crawlers and Gemini matching
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Target Job Types / Titles */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <label className="block text-slate-200 font-semibold">
                  Target Job Types / Titles ({targetTitles.length})
                </label>
                <p className="text-[11px] text-slate-400">
                  Add the exact roles you want the crawler to search for:
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTitleInput}
                    onChange={e => setNewTitleInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTitle(); } }}
                    placeholder="e.g. Lead Cloud Architect, Staff Backend..."
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTitle}
                    className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg shrink-0 transition-colors"
                  >
                    Add Title
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {targetTitles.map((title, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900 border border-slate-800 text-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-medium"
                    >
                      <span>{title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTitle(title)}
                        className="text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Keywords / Skills */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <label className="block text-slate-200 font-semibold">
                  Technical Skill Keywords ({primarySkills.length})
                </label>
                <p className="text-[11px] text-slate-400">
                  Add required and preferred technologies for vacancy matching and CV tailoring:
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    placeholder="e.g. Kubernetes, Golang, GraphQL..."
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg shrink-0 transition-colors"
                  >
                    Add Keyword
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {primarySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-sky-950/30 border border-sky-500/30 text-sky-300 font-mono text-[11px] px-2 py-0.5 rounded flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-sky-400/60 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Salary Floor & Allowed Work Formats Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-medium">Minimum Salary Floor</label>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">
                    £{Number(salaryFloor).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="40000"
                  max="150000"
                  step="5000"
                  value={salaryFloor}
                  onChange={e => setSalaryFloor(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <label className="text-slate-300 font-medium block">Allowed Work Formats</label>
                <div className="flex items-center gap-2">
                  {(['remote', 'hybrid', 'onsite'] as const).map(fmt => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => toggleFormat(fmt)}
                      className={`px-2.5 py-1 rounded text-xs capitalize transition-colors border ${
                        workFormats.includes(fmt)
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <label className="text-slate-300 font-medium block">Location & Max Commute</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="London / Reading"
                    className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-white text-xs"
                  />
                  <span className="text-slate-400 font-mono shrink-0">{commuteRadius}mi</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfileSettings}
                disabled={isSavingProfile}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Criteria'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1.5 flex items-center justify-between">
                <span>Targeted Job Roles:</span>
                <span className="text-[11px] text-sky-400">({profile.targetTitles.length} active roles)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.targetTitles.map((title, idx) => (
                  <span key={idx} className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-200 text-xs font-medium">
                    {title}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-medium mb-1.5 flex items-center justify-between">
                <span>Technical Skill Keywords:</span>
                <span className="text-[11px] text-sky-400">({profile.primarySkills.length} skills)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.primarySkills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-sky-300 font-mono text-[11px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fact Bank Header and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight font-display">
            Verified Fact Bank ({facts.length} Verifiable Claims)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-hallucination engine: The CV Tailor only draws from these verified statements. Every bullet traces to a Fact ID.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Verified Fact</span>
        </button>
      </div>

      {/* Facts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facts.map(fact => (
          <div
            key={fact.id}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/40 border border-sky-500/30 px-2 py-0.5 rounded">
                  {fact.id}
                </span>
                <span className="text-xs text-slate-400 font-medium">{fact.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">
                  Verified {fact.verifiedDate}
                </span>
                <button
                  onClick={() => onDeleteFact(fact.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove fact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed">
              "{fact.statement}"
            </p>

            <div className="pt-2.5 border-t border-slate-800/60 flex flex-col gap-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-slate-500">Tech:</span>
                <span className="font-mono text-slate-300">{fact.technologies.join(', ')}</span>
              </div>
              <div className="text-slate-500 truncate" title={fact.proofDocument}>
                Proof: {fact.proofDocument}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Fact */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-display">
              Add Verified Candidate Fact
            </h3>
            <p className="text-xs text-slate-400">
              Only enter truthful, verified accomplishments that you can defend in a technical interview.
            </p>

            <form onSubmit={handleCreateFact} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="System Architecture">System Architecture</option>
                  <option value="Quantifiable Impact">Quantifiable Impact</option>
                  <option value="Frontend & Web">Frontend & Web</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Team & Leadership">Team & Leadership</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Verifiable Statement
                </label>
                <textarea
                  rows={3}
                  value={statement}
                  onChange={e => setStatement(e.target.value)}
                  placeholder="e.g. Designed PostgreSQL sharding architecture supporting 20M rows with p95 query latency under 15ms."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Technologies Involved (comma separated)
                </label>
                <input
                  type="text"
                  value={technologies}
                  onChange={e => setTechnologies(e.target.value)}
                  placeholder="e.g. TypeScript, Node.js, PostgreSQL, Docker"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Proof Reference / Document
                </label>
                <input
                  type="text"
                  value={proofDocument}
                  onChange={e => setProofDocument(e.target.value)}
                  placeholder="e.g. GitHub Pull Request #412 or Reference Letter from VP"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-sky-400 hover:bg-sky-300 text-slate-950 font-semibold rounded-lg"
                >
                  {isSubmitting ? 'Saving Fact...' : 'Add Fact to Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

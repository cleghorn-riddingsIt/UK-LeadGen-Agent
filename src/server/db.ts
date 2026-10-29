import fs from 'fs';
import path from 'path';

export interface CandidateFact {
  id: string; // e.g. FACT-001
  category: 'System Architecture' | 'Cloud & DevOps' | 'Frontend & Web' | 'Team & Leadership' | 'Quantifiable Impact';
  statement: string;
  verifiedDate: string;
  proofDocument: string;
  technologies: string[];
}

export interface CandidateProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  commuteRadiusMiles: number;
  workFormats: ('remote' | 'hybrid' | 'onsite')[];
  salaryFloorGbp: number;
  rightToWorkInUk: boolean;
  rightToWorkDetails: string;
  targetTitles: string[];
  primarySkills: string[];
  secondarySkills: string[];
  blacklistedCompanies: string[];
  dailyEmailLimit: number;
  emailsSentToday: number;
  bounceRatePercent: number;
}

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  workFormat: 'remote' | 'hybrid' | 'onsite';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  source: 'Adzuna UK' | 'Reed UK' | 'Greenhouse ATS' | 'Lever ATS' | 'Indeed UK' | 'CV-Library';
  sourceUrl: string;
  requiredSkills: string[];
  rawDescription: string;
  dateScraped: string;
  status: 'raw' | 'parsed' | 'matched' | 'ats_verified' | 'sent' | 'interview' | 'rejected';
  matchScore?: number;
  atsScore?: number;
  atsKeywordCoveragePercent?: number;
  atsCleanParse?: boolean;
  tailoredCvMarkdown?: string;
  factCitations?: string[];
  rejectionReason?: string;
}

export interface CrawlerRun {
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

export interface HandoffEvent {
  id: string;
  vacancyId: string;
  company: string;
  roleTitle: string;
  recruiterName: string;
  employerMessage: string;
  intentType: 'interview_invitation' | 'scheduling_link' | 'screening_call' | 'additional_data' | 'auto_reply' | 'rejection';
  urgency: 'high' | 'normal' | 'low';
  receivedAt: string;
  latencySeconds: number;
  telegramPayload: {
    chatId: string;
    alertTitle: string;
    bodyMarkdown: string;
    actionButtons: { label: string; action: string }[];
  };
  candidateStatus: 'pending_takeover' | 'candidate_engaged' | 'call_logged';
  notes?: string;
}

export interface DatabaseState {
  profile: CandidateProfile;
  facts: CandidateFact[];
  vacancies: Vacancy[];
  crawlerRuns: CrawlerRun[];
  handoffs: HandoffEvent[];
}

const DB_FILE = path.resolve(process.cwd(), '.db_state.json');

const INITIAL_PROFILE: CandidateProfile = {
  name: 'Alex Morrison',
  email: 'alex.morrison.dev.uk@gmail.com',
  phone: '+44 7700 900142',
  location: 'London / Reading (Home Counties)',
  commuteRadiusMiles: 35,
  workFormats: ['remote', 'hybrid'],
  salaryFloorGbp: 75000,
  rightToWorkInUk: true,
  rightToWorkDetails: 'British Citizen / Indefinite Right to Work without visa sponsorship',
  targetTitles: [
    'Senior Full Stack Engineer',
    'Staff Software Engineer',
    'Lead Backend Engineer',
    'Senior TypeScript / Node Engineer',
    'AI / Full Stack Systems Engineer',
  ],
  primarySkills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Python', 'AWS', 'Docker', 'GraphQL'],
  secondarySkills: ['Kubernetes', 'Redis', 'Playwright', 'FastAPI', 'pgvector', 'Tailwind CSS'],
  blacklistedCompanies: [' predatory-recruitment-group-ltd', 'spam-contractors-uk'],
  dailyEmailLimit: 25,
  emailsSentToday: 14,
  bounceRatePercent: 0.8,
};

const INITIAL_FACTS: CandidateFact[] = [
  {
    id: 'FACT-001',
    category: 'System Architecture',
    statement: 'Architected high-throughput financial data streaming pipeline processing 45k transactions/second on Node.js and PostgreSQL with sub-12ms p99 latency.',
    verifiedDate: '2024-11-15',
    proofDocument: 'Reference Letter - Fintech UK Ltd / GitHub repository commit history',
    technologies: ['Node.js', 'PostgreSQL', 'Redis', 'TypeScript'],
  },
  {
    id: 'FACT-002',
    category: 'Quantifiable Impact',
    statement: 'Reduced cloud infrastructure egress costs by 38% (£42k/year savings) through aggressive response gzip caching, connection pooling, and pgvector semantic query indexing.',
    verifiedDate: '2025-03-10',
    proofDocument: 'AWS CloudWatch Billing Reports & Engineering Showcase deck',
    technologies: ['AWS', 'pgvector', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'FACT-003',
    category: 'Frontend & Web',
    statement: 'Led redesign of core B2B analytics portal in React 19 and Tailwind CSS, improving Core Web Vitals LCP from 3.8s to 0.9s and boosting weekly active users by 24%.',
    verifiedDate: '2025-06-20',
    proofDocument: 'Lighthouse audit logs & Google Analytics dashboard export',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
  },
  {
    id: 'FACT-004',
    category: 'Cloud & DevOps',
    statement: 'Engineered resilient Playwright test automation suite covering 140+ end-to-end critical purchase paths, cutting regression cycle time from 3 days to 45 minutes.',
    verifiedDate: '2025-08-12',
    proofDocument: 'GitHub Actions CI/CD workflows and SonarQube quality audit',
    technologies: ['Playwright', 'Docker', 'GitHub Actions', 'TypeScript'],
  },
  {
    id: 'FACT-005',
    category: 'Team & Leadership',
    statement: 'Mentored team of 6 engineers across London and remote European time zones, establishing RFC architecture review processes and pair programming rituals.',
    verifiedDate: '2025-09-01',
    proofDocument: 'Annual 360 review score: 4.9/5.0 & Manager commendation',
    technologies: ['Agile', 'Architecture RFCs', 'Code Review'],
  },
  {
    id: 'FACT-006',
    category: 'System Architecture',
    statement: 'Built multi-agent AI workflow using Gemini Flash and vector embeddings to parse unstructured supplier PDFs, reducing manual data entry time by 85%.',
    verifiedDate: '2026-01-18',
    proofDocument: 'Internal technical whitepaper & production deployment metrics',
    technologies: ['Python', 'Gemini API', 'PostgreSQL', 'FastAPI'],
  },
];

const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: 'VAC-UK-101',
    title: 'Senior Full Stack Engineer (TypeScript, Node, React)',
    company: 'Monolith Financial Technologies',
    location: 'London (Holborn) / Hybrid (1 day/week)',
    workFormat: 'hybrid',
    salaryMin: 85000,
    salaryMax: 95000,
    currency: 'GBP',
    source: 'Adzuna UK',
    sourceUrl: 'https://adzuna.co.uk/jobs/details/94827101',
    requiredSkills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'Docker'],
    rawDescription: 'Seeking an exceptional Senior Full Stack Engineer to scale our UK banking operations. Must have strong TypeScript, Node, React, and PostgreSQL background. Full right to work in the UK required. 1 day a week in Central London.',
    dateScraped: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'interview',
    matchScore: 96,
    atsScore: 92,
    atsKeywordCoveragePercent: 94,
    atsCleanParse: true,
    tailoredCvMarkdown: '# Alex Morrison\nLondon, UK · alex.morrison.dev.uk@gmail.com · +44 7700 900142\nFull UK Right to Work (British Citizen)\n\n## Summary\nSenior Full Stack Engineer with proven track record in high-throughput TypeScript, Node.js, and PostgreSQL systems. [FACT-001]\n\n## Experience\n- Architected high-throughput financial data streaming pipeline processing 45k transactions/second on Node.js and PostgreSQL with sub-12ms p99 latency. [FACT-001]\n- Led redesign of core B2B analytics portal in React 19 and Tailwind CSS, improving LCP to 0.9s. [FACT-003]\n- Reduced cloud infrastructure egress costs by 38% (£42k/yr) using pgvector and connection pooling. [FACT-002]',
    factCitations: ['FACT-001', 'FACT-002', 'FACT-003', 'FACT-004'],
  },
  {
    id: 'VAC-UK-102',
    title: 'Lead Platform / Backend Engineer (Distributed Systems)',
    company: 'Cortex Data Labs',
    location: 'Fully Remote (UK based)',
    workFormat: 'remote',
    salaryMin: 90000,
    salaryMax: 110000,
    currency: 'GBP',
    source: 'Greenhouse ATS',
    sourceUrl: 'https://boards.greenhouse.io/cortexdata/jobs/482910',
    requiredSkills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'AWS', 'Microservices'],
    rawDescription: 'Cortex Data Labs is hiring a UK remote Lead Platform Engineer. You will design distributed backend event queues, manage PostgreSQL clustering, and integrate modern AI workflows. Competitive equity, £90k-£110k.',
    dateScraped: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'sent',
    matchScore: 94,
    atsScore: 89,
    atsKeywordCoveragePercent: 91,
    atsCleanParse: true,
    tailoredCvMarkdown: '# Alex Morrison - Lead Platform Engineer\n\n- Architected high-throughput financial data streaming pipeline processing 45k transactions/second on Node.js and PostgreSQL. [FACT-001]\n- Mentored team of 6 engineers across European time zones with RFC processes. [FACT-005]\n- Engineered Playwright regression suite cutting release time by 80%. [FACT-004]',
    factCitations: ['FACT-001', 'FACT-004', 'FACT-005'],
  },
  {
    id: 'VAC-UK-103',
    title: 'Staff AI & Full Stack Systems Specialist',
    company: 'Synthetix UK',
    location: 'Bristol / Hybrid (2 days/month)',
    workFormat: 'hybrid',
    salaryMin: 80000,
    salaryMax: 95000,
    currency: 'GBP',
    source: 'Reed UK',
    sourceUrl: 'https://reed.co.uk/jobs/synthetix-ai-staff/582911',
    requiredSkills: ['Python', 'TypeScript', 'FastAPI', 'Gemini API', 'pgvector', 'Docker'],
    rawDescription: 'Looking for a Staff Engineer to bridge modern LLM integration and production full stack services. Must have hands-on experience building multi-agent workflows, vector indexing, and robust test pipelines.',
    dateScraped: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'ats_verified',
    matchScore: 91,
    atsScore: 88,
    atsKeywordCoveragePercent: 88,
    atsCleanParse: true,
    factCitations: ['FACT-006', 'FACT-002', 'FACT-004'],
  },
  {
    id: 'VAC-UK-104',
    title: 'Senior TypeScript Cloud Engineer',
    company: 'Apex Telemetry Solutions',
    location: 'Reading / Hybrid',
    workFormat: 'hybrid',
    salaryMin: 78000,
    salaryMax: 88000,
    currency: 'GBP',
    source: 'Lever ATS',
    sourceUrl: 'https://jobs.lever.co/apextelemetry/99201a',
    requiredSkills: ['TypeScript', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL'],
    rawDescription: 'Apex is scaling its telemetry data platform. We need a Senior TypeScript Engineer in Berkshire/Home Counties. Hybrid 2 days fortnightly in Reading.',
    dateScraped: new Date(Date.now() - 3600000 * 20).toISOString(),
    status: 'matched',
    matchScore: 89,
    atsScore: 86,
    atsKeywordCoveragePercent: 85,
    atsCleanParse: true,
  },
  {
    id: 'VAC-UK-105',
    title: 'Junior PHP / WordPress Webmaster',
    company: 'Local Agency Digital Ltd',
    location: 'London',
    workFormat: 'onsite',
    salaryMin: 32000,
    salaryMax: 38000,
    currency: 'GBP',
    source: 'Indeed UK',
    sourceUrl: 'https://indeed.co.uk/viewjob?jk=9182',
    requiredSkills: ['PHP', 'WordPress', 'CSS'],
    rawDescription: 'Junior webmaster needed for WordPress sites. Onsite in Croydon 5 days a week.',
    dateScraped: new Date(Date.now() - 3600000 * 26).toISOString(),
    status: 'rejected',
    matchScore: 32,
    rejectionReason: 'Below salary floor (£35k < £75k) and incompatible stack (PHP/WordPress vs TypeScript/Distributed Systems).',
  },
];

const INITIAL_RUNS: CrawlerRun[] = [
  {
    id: 'RUN-20261022-01',
    source: 'Adzuna UK API',
    targetQuery: 'Senior Full Stack Engineer TypeScript',
    targetLocation: 'London / Remote',
    minSalary: 75000,
    status: 'completed',
    startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    finishedAt: new Date(Date.now() - 3600000 * 2 + 180000).toISOString(),
    itemsFound: 42,
    newVacanciesAdded: 6,
    logs: [
      '[06:00:01] Authenticated against Adzuna UK API endpoint /v1/api/jobs/gb/search',
      '[06:00:04] Filter applied: country=gb, salary_min=75000, remote=1, hybrid=1',
      '[06:00:12] Retrieved 42 raw candidate postings across London & South East',
      '[06:00:19] Extracted clean salary ranges, filtered out recruiter agency duplicates',
      '[06:00:25] 6 vacancies passed hard filters (salary floor & tech stack overlap)',
      '[06:00:28] Synced to persistent database with status: raw_ingested',
    ],
  },
  {
    id: 'RUN-20261022-02',
    source: 'Playwright ATS Scraper',
    targetQuery: 'Greenhouse & Lever Direct Boards',
    targetLocation: 'UK Remote / London',
    minSalary: 80000,
    status: 'completed',
    startedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    finishedAt: new Date(Date.now() - 3600000 * 1 + 240000).toISOString(),
    itemsFound: 18,
    newVacanciesAdded: 3,
    logs: [
      '[07:00:02] Spawned Playwright chromium worker in headless stealth mode',
      '[07:00:05] User-Agent randomized: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
      '[07:00:12] Navigated to https://boards.greenhouse.io/cortexdata/jobs/482910',
      '[07:00:18] Clean DOM extracted; anti-bot check passed without CAPTCHA challenge',
      '[07:00:24] Navigated to https://jobs.lever.co/apextelemetry/99201a',
      '[07:00:32] Salary bracket £78k-£88k parsed via regex pattern GBP currency tags',
      '[07:00:41] 3 direct employer openings queued for Gemini Flash semantic evaluation',
    ],
  },
];

const INITIAL_HANDOFFS: HandoffEvent[] = [
  {
    id: 'HANDOFF-001',
    vacancyId: 'VAC-UK-101',
    company: 'Monolith Financial Technologies',
    roleTitle: 'Senior Full Stack Engineer (TypeScript, Node, React)',
    recruiterName: 'Claire Davies (Head of Talent)',
    employerMessage: 'Hi Alex, thank you for your tailored application. We were particularly impressed by your high-throughput Node.js pipeline work (FACT-001) and React 19 performance improvements. Would you have 30 minutes this Thursday or Friday for an introductory video call with our VP of Engineering? Here is our calendar link: https://calendly.com/claire-monolith/30min-intro',
    intentType: 'scheduling_link',
    urgency: 'high',
    receivedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    latencySeconds: 142, // Under 5 minutes SLA
    telegramPayload: {
      chatId: '@alex_morrison_bot',
      alertTitle: '🚨 INTERVIEW SCHEDULING LINK: Monolith Financial (£85k-£95k)',
      bodyMarkdown: '**Company**: Monolith Financial Technologies\n**Role**: Senior Full Stack Engineer\n**Recruiter**: Claire Davies\n**Intent**: Calendar scheduling link for 30-min VP call\n**Link**: https://calendly.com/claire-monolith/30min-intro\n\nAutomation paused on this thread. Candidate takeover requested!',
      actionButtons: [
        { label: 'Open Calendly Link', action: 'open_url' },
        { label: 'Mark as Candidate Handled', action: 'mark_engaged' },
      ],
    },
    candidateStatus: 'pending_takeover',
    notes: 'High priority. Matches top salary bracket (£95k). Thread automation frozen.',
  },
];

class DatabaseService {
  private state: DatabaseState;

  constructor() {
    this.state = this.load();
  }

  private load(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch {
      // fallback to initial state
    }
    const defaultState: DatabaseState = {
      profile: INITIAL_PROFILE,
      facts: INITIAL_FACTS,
      vacancies: INITIAL_VACANCIES,
      crawlerRuns: INITIAL_RUNS,
      handoffs: INITIAL_HANDOFFS,
    };
    this.saveState(defaultState);
    return defaultState;
  }

  private saveState(state: DatabaseState) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch {
      // silently ignore file write errors in transient tests
    }
  }

  public getProfile(): CandidateProfile {
    return this.state.profile;
  }

  public updateProfile(updated: Partial<CandidateProfile>): CandidateProfile {
    this.state.profile = { ...this.state.profile, ...updated };
    this.saveState(this.state);
    return this.state.profile;
  }

  public getFacts(): CandidateFact[] {
    return this.state.facts;
  }

  public addFact(fact: Omit<CandidateFact, 'id'>): CandidateFact {
    const nextNum = this.state.facts.length + 1;
    const newId = `FACT-${String(nextNum).padStart(3, '0')}`;
    const newFact: CandidateFact = { id: newId, ...fact };
    this.state.facts.push(newFact);
    this.saveState(this.state);
    return newFact;
  }

  public updateFact(id: string, updated: Partial<CandidateFact>): CandidateFact | null {
    const idx = this.state.facts.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.state.facts[idx] = { ...this.state.facts[idx], ...updated };
    this.saveState(this.state);
    return this.state.facts[idx];
  }

  public deleteFact(id: string): boolean {
    const before = this.state.facts.length;
    this.state.facts = this.state.facts.filter(f => f.id !== id);
    const changed = this.state.facts.length !== before;
    if (changed) this.saveState(this.state);
    return changed;
  }

  public getVacancies(): Vacancy[] {
    return this.state.vacancies;
  }

  public getVacancyById(id: string): Vacancy | undefined {
    return this.state.vacancies.find(v => v.id === id);
  }

  public addVacancies(newItems: Vacancy[]): number {
    let added = 0;
    for (const item of newItems) {
      if (!this.state.vacancies.some(v => v.id === item.id || (v.company.toLowerCase() === item.company.toLowerCase() && v.title.toLowerCase() === item.title.toLowerCase()))) {
        this.state.vacancies.unshift(item);
        added++;
      }
    }
    if (added > 0) this.saveState(this.state);
    return added;
  }

  public updateVacancy(id: string, updated: Partial<Vacancy>): Vacancy | null {
    const idx = this.state.vacancies.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.state.vacancies[idx] = { ...this.state.vacancies[idx], ...updated };
    this.saveState(this.state);
    return this.state.vacancies[idx];
  }

  public getCrawlerRuns(): CrawlerRun[] {
    return this.state.crawlerRuns;
  }

  public addCrawlerRun(run: CrawlerRun) {
    this.state.crawlerRuns.unshift(run);
    this.saveState(this.state);
  }

  public updateCrawlerRun(id: string, updated: Partial<CrawlerRun>) {
    const idx = this.state.crawlerRuns.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.state.crawlerRuns[idx] = { ...this.state.crawlerRuns[idx], ...updated };
      this.saveState(this.state);
    }
  }

  public getHandoffs(): HandoffEvent[] {
    return this.state.handoffs;
  }

  public addHandoff(handoff: HandoffEvent) {
    this.state.handoffs.unshift(handoff);
    this.saveState(this.state);
  }

  public updateHandoffStatus(id: string, status: 'pending_takeover' | 'candidate_engaged' | 'call_logged'): boolean {
    const item = this.state.handoffs.find(h => h.id === id);
    if (item) {
      item.candidateStatus = status;
      this.saveState(this.state);
      return true;
    }
    return false;
  }
}

export const db = new DatabaseService();

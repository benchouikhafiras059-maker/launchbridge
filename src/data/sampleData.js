export const initialTasks = [
  {
    id: 't1',
    title: 'Submit OPT application to ISSO office',
    category: 'visa',
    deadline: '2026-06-01',
    priority: 'high',
    status: 'in-progress',
  },
  {
    id: 't2',
    title: 'Confirm graduation date on I-20 with advisor',
    category: 'visa',
    deadline: '2026-05-25',
    priority: 'high',
    status: 'not-started',
  },
  {
    id: 't3',
    title: 'Update resume with recent projects and skills',
    category: 'job',
    deadline: '2026-05-22',
    priority: 'high',
    status: 'in-progress',
  },
  {
    id: 't4',
    title: 'Apply to 5 UX roles this week',
    category: 'job',
    deadline: '2026-05-24',
    priority: 'high',
    status: 'not-started',
  },
  {
    id: 't5',
    title: 'Follow up with recruiter at Google',
    category: 'networking',
    deadline: '2026-05-20',
    priority: 'medium',
    status: 'not-started',
  },
  {
    id: 't6',
    title: 'Research apartments in Washington DC',
    category: 'housing',
    deadline: '2026-06-15',
    priority: 'medium',
    status: 'not-started',
  },
  {
    id: 't7',
    title: 'Create monthly post-graduation budget',
    category: 'finances',
    deadline: '2026-05-30',
    priority: 'medium',
    status: 'not-started',
  },
  {
    id: 't8',
    title: 'Schedule meeting with international student advisor',
    category: 'visa',
    deadline: '2026-05-23',
    priority: 'high',
    status: 'not-started',
  },
  {
    id: 't9',
    title: 'Prepare portfolio case study for interviews',
    category: 'job',
    deadline: '2026-05-28',
    priority: 'high',
    status: 'in-progress',
  },
  {
    id: 't10',
    title: 'Check health insurance options after graduation',
    category: 'personal',
    deadline: '2026-06-01',
    priority: 'medium',
    status: 'not-started',
  },
  {
    id: 't11',
    title: 'Open US bank account',
    category: 'finances',
    deadline: '2026-06-10',
    priority: 'medium',
    status: 'done',
  },
  {
    id: 't12',
    title: 'Connect with alumni in your field on LinkedIn',
    category: 'networking',
    deadline: '2026-05-31',
    priority: 'low',
    status: 'not-started',
  },
  {
    id: 't13',
    title: 'Request official transcripts from registrar',
    category: 'personal',
    deadline: '2026-06-01',
    priority: 'medium',
    status: 'not-started',
  },
  {
    id: 't14',
    title: 'Review OPT timeline and USCIS requirements',
    category: 'visa',
    deadline: '2026-05-20',
    priority: 'high',
    status: 'done',
  },
];

export const initialDocuments = [
  { id: 'd1', name: 'Passport', status: 'ready' },
  { id: 'd2', name: 'I-20 Form', status: 'ready' },
  { id: 'd3', name: 'OPT Application Receipt', status: 'in-progress' },
  { id: 'd4', name: 'EAD Card', status: 'missing' },
  { id: 'd5', name: 'Resume (latest version)', status: 'in-progress' },
  { id: 'd6', name: 'Lease Agreement', status: 'missing' },
  { id: 'd7', name: 'Offer Letter', status: 'missing' },
  { id: 'd8', name: 'Health Insurance Card', status: 'missing' },
];

export const initialJobs = [
  {
    id: 'j1',
    company: 'Figma',
    role: 'Product Designer',
    status: 'applied',
    nextAction: 'Follow up by May 25',
    dateApplied: '2026-05-12',
  },
  {
    id: 'j2',
    company: 'Google',
    role: 'UX Researcher',
    status: 'interviewing',
    nextAction: 'Prepare for 2nd round interview this week',
    dateApplied: '2026-05-05',
    interviews: [
      { id: 'i1', round: 1, date: '2026-05-14', type: 'Phone Screen', outcome: 'passed', notes: 'Focused on design process and handling feedback. Very process-oriented interviewer.' },
      { id: 'i2', round: 2, date: '2026-05-28', type: 'Video Interview', outcome: 'pending', notes: '' },
    ],
  },
  {
    id: 'j3',
    company: 'Notion',
    role: 'UX Designer',
    status: 'saved',
    nextAction: 'Customize resume and apply',
    dateApplied: '',
  },
  {
    id: 'j4',
    company: 'Duolingo',
    role: 'Product Designer',
    status: 'applied',
    nextAction: 'Wait for response',
    dateApplied: '2026-05-15',
  },
  {
    id: 'j5',
    company: 'Meta',
    role: 'UX Designer',
    status: 'rejected',
    nextAction: 'Request feedback from recruiter',
    dateApplied: '2026-04-28',
  },
];

export const initialOptSteps = [
  { id: 'os1', title: 'Confirm graduation date with DSO on I-20', status: 'done', date: '2026-04-15', note: 'Advisor confirmed May 15 graduation date' },
  { id: 'os2', title: 'Complete OPT application (Form I-765)', status: 'in-progress', date: '', note: '' },
  { id: 'os3', title: 'Get OPT recommendation from ISSO office', status: 'pending', date: '', note: '' },
  { id: 'os4', title: 'Mail application package to USCIS', status: 'pending', date: '', note: '' },
  { id: 'os5', title: 'Receive USCIS receipt notice (I-797)', status: 'pending', date: '', note: '' },
  { id: 'os6', title: 'EAD card received in mail', status: 'pending', date: '', note: '' },
  { id: 'os7', title: 'Report new employer to DSO within 10 days of starting', status: 'pending', date: '', note: '' },
];

export const initialBudgetItems = [
  { id: 'b1', type: 'income', label: 'Monthly Salary (estimated)', amount: 5500 },
  { id: 'b2', type: 'expense', label: 'Rent', amount: 1800 },
  { id: 'b3', type: 'expense', label: 'Groceries', amount: 350 },
  { id: 'b4', type: 'expense', label: 'Transportation', amount: 120 },
  { id: 'b5', type: 'expense', label: 'Health Insurance', amount: 200 },
  { id: 'b6', type: 'expense', label: 'Utilities', amount: 90 },
  { id: 'b7', type: 'expense', label: 'Phone', amount: 65 },
  { id: 'b8', type: 'expense', label: 'Subscriptions', amount: 40 },
];

export const initialApartments = [
  { id: 'a1', name: 'Cortland Morrison', address: '1234 K St NW, Washington DC', rent: 2100, beds: 1, status: 'interested', notes: 'Close to metro, modern finishes' },
  { id: 'a2', name: 'The Meridian', address: '890 7th St NW, Washington DC', rent: 1850, beds: 1, status: 'toured', notes: 'Toured May 18 — loved the layout, small kitchen' },
  { id: 'a3', name: 'RESA Apartments', address: '455 Eye St SW, Washington DC', rent: 1700, beds: 1, status: 'applied', notes: 'Applied May 20, waiting for credit check' },
];

export const initialContacts = [
  { id: 'c1', name: 'Sarah Kim', company: 'Google', role: 'UX Researcher', how: 'Career Fair', lastContact: '2026-05-15', followUp: '2026-05-30', notes: 'Met at SCAD career fair. Referred me to the UX team hiring manager.' },
  { id: 'c2', name: 'Marcus Webb', company: 'Figma', role: 'Product Designer', how: 'LinkedIn', lastContact: '2026-05-10', followUp: '2026-05-28', notes: 'Reached out cold. Open to a 20-min coffee chat next week.' },
  { id: 'c3', name: 'Professor Tim Lindsey', company: 'SCAD', role: 'AI 201 Professor', how: 'Class', lastContact: '2026-05-20', followUp: '', notes: 'Asked for a letter of recommendation. Very supportive.' },
];

export const initialNotes = [
  {
    id: 'n1',
    title: 'Google UX Interview — Round 1 Notes',
    content:
      "They focused heavily on the design process and how I handle feedback. Prepare a portfolio story showing clear iteration. Interviewer was very process-oriented. Ask about team structure and collaboration in Round 2. Study Google's design principles before next interview.",
    date: '2026-05-14',
  },
  {
    id: 'n2',
    title: 'Advisor Meeting — OPT & Housing',
    content:
      'Confirmed OPT start date timeline. Need to submit I-20 update with graduation date confirmed. Professor Tim recommended connecting with the international student office for housing resources. ISSO office hours: T/Th 2–4pm. Deadline to submit OPT application is 90 days before graduation.',
    date: '2026-05-10',
  },
];

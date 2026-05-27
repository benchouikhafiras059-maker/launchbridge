export function calculateReadinessScore(tasks, documents, jobs) {
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const taskScore = tasks.length > 0 ? (doneTasks / tasks.length) * 50 : 0;

  const readyDocs = documents.filter((d) => d.status === 'ready').length;
  const docScore = documents.length > 0 ? (readyDocs / documents.length) * 30 : 0;

  const activeJobs = jobs.filter((j) => ['applied', 'interviewing'].includes(j.status)).length;
  const jobScore = jobs.length > 0 ? Math.min((activeJobs / jobs.length) * 30, 20) : 0;

  return Math.round(taskScore + docScore + jobScore);
}

export function getTopPriorities(tasks) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  return tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const aDate = new Date(a.deadline + 'T00:00:00');
      const bDate = new Date(b.deadline + 'T00:00:00');
      const aOverdue = aDate < today;
      const bOverdue = bDate < today;
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      if (aDate.getTime() !== bDate.getTime()) return aDate - bDate;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);
}

export function getCategoryConfig(category) {
  const map = {
    visa: { label: 'Visa / OPT', bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-400', dot: 'bg-purple-400' },
    job: { label: 'Job Search', bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-400', dot: 'bg-blue-400' },
    housing: { label: 'Housing', bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-400', dot: 'bg-amber-400' },
    finances: { label: 'Finances', bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-400', dot: 'bg-emerald-400' },
    networking: { label: 'Networking', bg: 'bg-rose-100', text: 'text-rose-700', bar: 'bg-rose-400', dot: 'bg-rose-400' },
    personal: { label: 'Personal', bg: 'bg-teal-100', text: 'text-teal-700', bar: 'bg-teal-400', dot: 'bg-teal-400' },
  };
  return map[category] || map.personal;
}

export function getStatusConfig(status) {
  const map = {
    'not-started': { label: 'Not Started', bg: 'bg-slate-100', text: 'text-slate-600' },
    'in-progress': { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-600' },
    done: { label: 'Done', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  };
  return map[status] || map['not-started'];
}

export function getPriorityConfig(priority) {
  const map = {
    high: { label: 'High', bg: 'bg-red-50', text: 'text-red-600' },
    medium: { label: 'Medium', bg: 'bg-amber-50', text: 'text-amber-600' },
    low: { label: 'Low', bg: 'bg-slate-100', text: 'text-slate-500' },
  };
  return map[priority] || map.low;
}

export function getJobStatusConfig(status) {
  const map = {
    saved: { label: 'Saved', bg: 'bg-slate-100', text: 'text-slate-600' },
    applied: { label: 'Applied', bg: 'bg-blue-50', text: 'text-blue-600' },
    interviewing: { label: 'Interviewing', bg: 'bg-violet-50', text: 'text-violet-700' },
    'follow-up': { label: 'Follow-up', bg: 'bg-amber-50', text: 'text-amber-700' },
    rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-500' },
  };
  return map[status] || map.saved;
}

export function getDocStatusConfig(status) {
  const map = {
    missing: { label: 'Missing', bg: 'bg-red-50', text: 'text-red-500' },
    'in-progress': { label: 'In Progress', bg: 'bg-amber-50', text: 'text-amber-600' },
    ready: { label: 'Ready', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  };
  return map[status] || map.missing;
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getDaysUntil(deadline) {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline + 'T00:00:00');
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function getCategoryProgress(tasks) {
  const categories = ['visa', 'job', 'housing', 'finances', 'networking', 'personal'];
  return categories.map((cat) => {
    const all = tasks.filter((t) => t.category === cat);
    const done = all.filter((t) => t.status === 'done').length;
    return {
      category: cat,
      total: all.length,
      done,
      percent: all.length > 0 ? Math.round((done / all.length) * 100) : 0,
    };
  });
}

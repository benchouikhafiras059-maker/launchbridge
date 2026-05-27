import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import {
  calculateReadinessScore,
  getCategoryConfig,
  getCategoryProgress,
  getDocStatusConfig,
  getDaysUntil,
  formatDate,
  getStatusConfig,
} from '../utils/helpers';

function ReadinessRing({ score }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#6366f1' : '#f59e0b';
  const label = score >= 70 ? 'On Track' : score >= 45 ? 'In Progress' : 'Getting Started';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="112" height="112" className="-rotate-90">
          <circle cx="56" cy="56" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="9" />
          <circle
            cx="56" cy="56" r={radius} fill="none"
            stroke={color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{score}</span>
          <span className="text-[10px] text-slate-400">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-slate-600">{label}</span>
    </div>
  );
}

function UrgentTaskCard({ task }) {
  const days = getDaysUntil(task.deadline);
  const overdue = days !== null && days < 0;
  const cat = getCategoryConfig(task.category);
  const status = getStatusConfig(task.status);

  return (
    <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-slate-100 shadow-sm">
      <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${cat.dot} mt-2`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${cat.bg} ${cat.text}`}>
            {cat.label}
          </span>
          <span className={`text-[11px] font-medium ${overdue ? 'text-red-500' : 'text-slate-500'}`}>
            {overdue
              ? `Overdue ${Math.abs(days)}d`
              : days === 0
              ? 'Due today'
              : `Due ${formatDate(task.deadline)}`}
          </span>
        </div>
      </div>
      <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${status.bg} ${status.text}`}>
        {status.label}
      </span>
    </div>
  );
}

function CategoryBar({ category, done, total, percent }) {
  const cfg = getCategoryConfig(category);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-700">{cfg.label}</span>
        <span className="text-xs text-slate-400">{done}/{total}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${cfg.bar} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard({ tasks, documents, jobs, profile }) {
  const score = calculateReadinessScore(tasks, documents, jobs);
  const progress = getCategoryProgress(tasks);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const urgentTasks = tasks
    .filter((t) => t.status !== 'done')
    .filter((t) => {
      const d = getDaysUntil(t.deadline);
      return d !== null && d <= 5;
    })
    .sort((a, b) => getDaysUntil(a.deadline) - getDaysUntil(b.deadline))
    .slice(0, 4);

  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const overdueCount = tasks.filter((t) => {
    const d = getDaysUntil(t.deadline);
    return t.status !== 'done' && d !== null && d < 0;
  }).length;

  const hour = new Date().getHours();
  const firstName = profile?.name?.split(' ')[0];
  const greetingBase = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greeting = firstName ? `${greetingBase}, ${firstName}` : greetingBase;

  const optCountdown = (() => {
    if (!profile?.graduationDate) return null;
    const grad = new Date(profile.graduationDate + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const optDeadline = new Date(grad); optDeadline.setDate(optDeadline.getDate() - 90);
    const daysToDeadline = Math.ceil((optDeadline - today) / 86400000);
    const daysToGrad = Math.ceil((grad - today) / 86400000);
    const graceEnd = new Date(grad); graceEnd.setDate(graceEnd.getDate() + 60);
    const daysToGrace = Math.ceil((graceEnd - today) / 86400000);
    if (profile?.optStatus === 'EAD received') return { type: 'done', message: 'EAD received — you\'re authorized to work!' };
    if (daysToDeadline > 0) return { type: 'deadline', days: daysToDeadline, label: 'to apply for OPT', urgent: daysToDeadline <= 14 };
    if (daysToGrad > 0) return { type: 'late', message: `OPT deadline passed — apply ASAP. ${daysToGrad}d until graduation.` };
    if (daysToGrace > 0) return { type: 'grace', days: daysToGrace, label: 'left in 60-day grace period' };
    return { type: 'expired', message: 'Grace period ended. Contact your DSO immediately.' };
  })();

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{greeting}.</h1>
        <p className="text-slate-500 mt-1 text-sm">Here's your post-graduation transition overview.</p>
      </div>

      {/* OPT Countdown banner */}
      {optCountdown && (
        <div className={`flex items-center gap-4 rounded-2xl px-5 py-4 mb-6 ${
          optCountdown.type === 'done' ? 'bg-emerald-50 border border-emerald-100' :
          optCountdown.type === 'deadline' && optCountdown.urgent ? 'bg-red-50 border border-red-100' :
          optCountdown.type === 'deadline' ? 'bg-indigo-50 border border-indigo-100' :
          optCountdown.type === 'grace' ? 'bg-amber-50 border border-amber-100' :
          'bg-red-50 border border-red-100'
        }`}>
          <div className={`text-2xl font-black leading-none ${
            optCountdown.type === 'done' ? 'text-emerald-600' :
            optCountdown.urgent || optCountdown.type === 'expired' ? 'text-red-600' :
            optCountdown.type === 'grace' ? 'text-amber-600' : 'text-indigo-600'
          }`}>
            {optCountdown.days !== undefined ? optCountdown.days : '✓'}
          </div>
          <div>
            <p className={`text-sm font-bold ${
              optCountdown.type === 'done' ? 'text-emerald-800' :
              optCountdown.urgent || optCountdown.type === 'expired' ? 'text-red-800' :
              optCountdown.type === 'grace' ? 'text-amber-800' : 'text-indigo-800'
            }`}>
              {optCountdown.label ? `${optCountdown.days} days ${optCountdown.label}` : optCountdown.message}
            </p>
            <p className={`text-xs mt-0.5 ${
              optCountdown.type === 'done' ? 'text-emerald-600' :
              optCountdown.urgent ? 'text-red-600' :
              optCountdown.type === 'grace' ? 'text-amber-600' : 'text-indigo-500'
            }`}>
              {optCountdown.type === 'deadline' ? 'OPT application window — apply at least 90 days before graduation' :
               optCountdown.type === 'grace' ? 'Find employment or change status before the grace period ends' :
               optCountdown.type === 'done' ? 'Keep your DSO updated on any employer changes within 10 days' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Top row: Score + Stats + Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-6">
        {/* Readiness score */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center justify-center gap-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider self-start">Readiness Score</p>
          <ReadinessRing score={score} />
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            Tasks · Documents · Applications
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Progress</p>
          <StatItem
            icon={<CheckCircle2 size={16} className="text-emerald-500" />}
            label="Tasks completed"
            value={`${doneTasks} of ${tasks.length}`}
            color="text-emerald-600"
          />
          <StatItem
            icon={<Clock size={16} className="text-blue-400" />}
            label="In progress"
            value={`${tasks.filter((t) => t.status === 'in-progress').length} tasks`}
            color="text-blue-600"
          />
          {overdueCount > 0 && (
            <StatItem
              icon={<AlertTriangle size={16} className="text-red-400" />}
              label="Overdue"
              value={`${overdueCount} tasks`}
              color="text-red-500"
            />
          )}
          <StatItem
            icon={<span className="text-sm">💼</span>}
            label="Active applications"
            value={`${jobs.filter((j) => ['applied', 'interviewing'].includes(j.status)).length} jobs`}
            color="text-indigo-600"
          />
        </div>

        {/* Document status mini summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Documents</p>
          <div className="space-y-2">
            {documents.slice(0, 5).map((doc) => {
              const cfg = getDocStatusConfig(doc.status);
              return (
                <div key={doc.id} className="flex items-center justify-between">
                  <span className="text-xs text-slate-700 truncate mr-2">{doc.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
            {documents.length > 5 && (
              <p className="text-[11px] text-slate-400">+{documents.length - 5} more</p>
            )}
          </div>
        </div>
      </div>

      {/* Today's focus */}
      {urgentTasks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            Needs attention soon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {urgentTasks.map((task) => (
              <UrgentTaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Category progress */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Progress by Category</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {progress.map((p) => (
            <CategoryBar key={p.category} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-slate-600">{label}</span>
      </div>
      <span className={`text-xs font-semibold ${color}`}>{value}</span>
    </div>
  );
}

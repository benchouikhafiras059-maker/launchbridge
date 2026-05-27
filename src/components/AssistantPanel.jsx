import { AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { getTopPriorities, getCategoryConfig, getDaysUntil, calculateReadinessScore } from '../utils/helpers';

function PriorityCard({ task, rank }) {
  const cat = getCategoryConfig(task.category);
  const days = getDaysUntil(task.deadline);
  const overdue = days !== null && days < 0;
  const urgent = days !== null && days <= 3;

  let reason = '';
  if (overdue) reason = `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`;
  else if (days === 0) reason = 'Due today';
  else if (urgent) reason = `Due in ${days} day${days !== 1 ? 's' : ''}`;
  else if (task.priority === 'high') reason = 'High priority';
  else reason = `Due ${getDaysLabel(days)}`;

  return (
    <div className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
          rank === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 leading-snug">{task.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${cat.bg} ${cat.text}`}>
            {cat.label}
          </span>
          <span
            className={`text-[11px] font-medium ${
              overdue ? 'text-red-500' : urgent ? 'text-amber-500' : 'text-slate-400'
            }`}
          >
            {overdue && <span className="inline-block mr-0.5">⚠</span>}
            {reason}
          </span>
        </div>
      </div>
    </div>
  );
}

function getDaysLabel(days) {
  if (days === null) return '';
  if (days <= 7) return `in ${days}d`;
  return `in ${Math.ceil(days / 7)}w`;
}

export default function AssistantPanel({ tasks, documents, jobs }) {
  const top3 = getTopPriorities(tasks);
  const score = calculateReadinessScore(tasks, documents, jobs);
  const incomplete = tasks.filter((t) => t.status !== 'done').length;
  const overdueCount = tasks.filter((t) => {
    const d = getDaysUntil(t.deadline);
    return t.status !== 'done' && d !== null && d < 0;
  }).length;

  const readyDocs = documents.filter((d) => d.status === 'ready').length;
  const activeJobs = jobs.filter((j) => ['applied', 'interviewing'].includes(j.status)).length;

  const scoreLabel =
    score >= 75 ? 'On Track' : score >= 50 ? 'Making Progress' : score >= 25 ? 'Getting Started' : 'Just Beginning';
  const scoreColor =
    score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-indigo-600' : score >= 25 ? 'text-amber-600' : 'text-slate-500';

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
        {/* Top 3 priorities */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Top Priorities</p>
          {top3.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-emerald-600 font-medium">All tasks complete!</p>
              <p className="text-xs text-slate-400 mt-1">You're in great shape.</p>
            </div>
          ) : (
            <div>
              {top3.map((task, i) => (
                <PriorityCard key={task.id} task={task} rank={i + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Stats</p>
          <div className="space-y-2.5">
            <StatRow
              icon={<Clock size={13} className="text-slate-400" />}
              label="Tasks remaining"
              value={`${incomplete} tasks`}
              valueColor="text-slate-900"
            />
            {overdueCount > 0 && (
              <StatRow
                icon={<AlertCircle size={13} className="text-red-400" />}
                label="Overdue"
                value={`${overdueCount} task${overdueCount !== 1 ? 's' : ''}`}
                valueColor="text-red-600"
              />
            )}
            <StatRow
              icon={<TrendingUp size={13} className="text-slate-400" />}
              label="Active applications"
              value={`${activeJobs} job${activeJobs !== 1 ? 's' : ''}`}
              valueColor="text-slate-900"
            />
            <StatRow
              icon={<span className="text-[11px]">📄</span>}
              label="Docs ready"
              value={`${readyDocs} / ${documents.length}`}
              valueColor={readyDocs === documents.length ? 'text-emerald-600' : 'text-slate-900'}
            />
          </div>
        </div>

        {/* Score summary */}
        <div className="mt-5 bg-slate-50 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-600">Readiness Score</p>
            <span className={`text-xs font-semibold ${scoreColor}`}>{scoreLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-900 w-8 text-right">{score}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            Based on completed tasks, document readiness, and active job applications.
          </p>
        </div>

        {/* Tip */}
        <div className="mt-4 bg-indigo-50 rounded-xl p-3.5">
          <p className="text-xs font-semibold text-indigo-700 mb-1">Tip for today</p>
          <p className="text-xs text-indigo-600 leading-relaxed">
            {getTip(score, overdueCount, readyDocs, documents.length)}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <span className={`text-xs font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}

function getTip(score, overdueCount, readyDocs, totalDocs) {
  if (overdueCount > 0)
    return 'You have overdue tasks. Start with those — clearing them will reduce stress and improve your readiness score.';
  if (readyDocs < totalDocs * 0.5)
    return 'Your documents section needs attention. Getting key immigration documents ready is time-sensitive.';
  if (score < 40)
    return 'Focus on one category at a time. Start with Visa / OPT tasks — those have the hardest deadlines.';
  if (score < 70)
    return 'Good momentum. Try tackling 2–3 job applications today alongside your highest-priority task.';
  return 'You\'re on track. Keep the momentum going and stay consistent with your networking outreach.';
}

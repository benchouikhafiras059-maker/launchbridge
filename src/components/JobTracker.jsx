import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from './Modal';
import { getJobStatusConfig, formatDate, generateId } from '../utils/helpers';

const JOB_STATUSES = ['saved', 'applied', 'interviewing', 'follow-up', 'rejected'];
const INTERVIEW_TYPES = ['Phone Screen', 'Video Interview', 'Technical', 'Take-home', 'Onsite', 'Final Round'];
const INTERVIEW_OUTCOMES = ['pending', 'passed', 'rejected'];

const outcomeConfig = {
  pending: { label: 'Pending', bg: 'bg-slate-100', text: 'text-slate-600' },
  passed: { label: 'Passed', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-500' },
};

function StatusPill({ status }) {
  const cfg = getJobStatusConfig(status);
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}

function InterviewRoundForm({ round, jobId, onSave, onClose }) {
  const [form, setForm] = useState(round || { type: 'Phone Screen', date: '', outcome: 'pending', notes: '' });
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: round?.id || generateId('iv') });
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Interview type</label>
          <select value={form.type} onChange={(e) => set('type', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" autoFocus>
            {INTERVIEW_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Date</label>
          <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Outcome</label>
        <div className="flex gap-2">
          {INTERVIEW_OUTCOMES.map((o) => (
            <button key={o} type="button" onClick={() => set('outcome', o)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${form.outcome === o ? `${outcomeConfig[o].bg} ${outcomeConfig[o].text} border-current` : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
              {outcomeConfig[o].label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Notes</label>
        <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
          placeholder="What was asked? What to prepare for next time?"
          rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          {round ? 'Save changes' : 'Add round'}
        </button>
      </div>
    </form>
  );
}

function InterviewsPanel({ job, onUpdateJob }) {
  const [showForm, setShowForm] = useState(null); // null | 'add' | round object
  const interviews = job.interviews || [];

  const handleSave = (round) => {
    const existing = interviews.find((r) => r.id === round.id);
    const updated = existing
      ? interviews.map((r) => (r.id === round.id ? round : r))
      : [...interviews, { ...round, round: interviews.length + 1 }];
    onUpdateJob({ ...job, interviews: updated });
  };
  const handleDelete = (id) => onUpdateJob({ ...job, interviews: interviews.filter((r) => r.id !== id) });

  return (
    <div className="px-4 pb-4 pt-2 border-t border-slate-50">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interview Rounds</p>
        <button onClick={() => setShowForm('add')}
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800">
          <Plus size={12} /> Add round
        </button>
      </div>
      {interviews.length === 0 ? (
        <p className="text-xs text-slate-400">No rounds logged yet.</p>
      ) : (
        <div className="space-y-2">
          {interviews.map((iv) => {
            const oc = outcomeConfig[iv.outcome] || outcomeConfig.pending;
            return (
              <div key={iv.id} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-indigo-600">{iv.round}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-slate-800">{iv.type}</p>
                    {iv.date && <p className="text-[10px] text-slate-400">{formatDate(iv.date)}</p>}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${oc.bg} ${oc.text}`}>{oc.label}</span>
                  </div>
                  {iv.notes && <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{iv.notes}</p>}
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button onClick={() => setShowForm(iv)} className="p-1 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded"><Pencil size={11} /></button>
                  <button onClick={() => handleDelete(iv.id)} className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={11} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showForm !== null && (
        <Modal title={showForm === 'add' ? 'Add interview round' : 'Edit round'} onClose={() => setShowForm(null)}>
          <InterviewRoundForm round={showForm === 'add' ? null : showForm} onSave={handleSave} onClose={() => setShowForm(null)} />
        </Modal>
      )}
    </div>
  );
}

function JobRow({ job, onEdit, onDelete, onUpdateJob }) {
  const [expanded, setExpanded] = useState(false);
  const ivCount = (job.interviews || []).length;
  return (
    <>
      <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <td className="px-4 py-3.5">
          <p className="text-sm font-semibold text-slate-900">{job.company}</p>
          <p className="text-xs text-slate-500 mt-0.5">{job.role}</p>
        </td>
        <td className="px-4 py-3.5">
          <StatusPill status={job.status} />
        </td>
        <td className="px-4 py-3.5">
          <p className="text-xs text-slate-600 max-w-xs">{job.nextAction || '—'}</p>
        </td>
        <td className="px-4 py-3.5">
          <p className="text-xs text-slate-400">{formatDate(job.dateApplied)}</p>
        </td>
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1">
            <button onClick={() => setExpanded((v) => !v)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${expanded ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}>
              {ivCount > 0 && <span className="text-[10px]">{ivCount}</span>}
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            <button onClick={() => onEdit(job)} className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Pencil size={13} /></button>
            <button onClick={() => onDelete(job.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-slate-100 bg-slate-50/50">
          <td colSpan={5} className="p-0">
            <InterviewsPanel job={job} onUpdateJob={onUpdateJob} />
          </td>
        </tr>
      )}
    </>
  );
}

function JobForm({ job, onSave, onClose }) {
  const [form, setForm] = useState(
    job || { company: '', role: '', status: 'saved', nextAction: '', dateApplied: '' }
  );
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onSave({ ...form, id: job?.id || generateId('j') });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Company</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="Company name"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Role</label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            placeholder="Job title"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>{getJobStatusConfig(s).label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Date applied</label>
          <input
            type="date"
            value={form.dateApplied}
            onChange={(e) => set('dateApplied', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Next action</label>
        <input
          type="text"
          value={form.nextAction}
          onChange={(e) => set('nextAction', e.target.value)}
          placeholder="What's the next step for this application?"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          {job ? 'Save changes' : 'Add application'}
        </button>
      </div>
    </form>
  );
}

export default function JobTracker({ jobs, setJobs }) {
  const [modal, setModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const counts = JOB_STATUSES.reduce((acc, s) => {
    acc[s] = jobs.filter((j) => j.status === s).length;
    return acc;
  }, {});

  const filtered = statusFilter === 'all' ? jobs : jobs.filter((j) => j.status === statusFilter);

  const handleSave = (job) => {
    setJobs((prev) => {
      const exists = prev.find((j) => j.id === job.id);
      return exists ? prev.map((j) => (j.id === job.id ? job : j)) : [...prev, job];
    });
  };

  const handleUpdateJob = (job) => {
    setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
  };

  const handleDelete = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Track your applications from save to offer.</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm"
        >
          <Plus size={15} />
          Add application
        </button>
      </div>

      {/* Status summary */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({jobs.length})
        </button>
        {JOB_STATUSES.map((s) => {
          const cfg = getJobStatusConfig(s);
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === s ? `${cfg.bg} ${cfg.text} ring-1 ring-current ring-opacity-40` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cfg.label} ({counts[s]})
            </button>
          );
        })}
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-slate-400 text-sm">No applications in this category.</p>
          </div>
        ) : filtered.map((job) => {
          const ivCount = (job.interviews || []).length;
          return (
            <div key={job.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{job.company}</p>
                    <p className="text-xs text-slate-500">{job.role}</p>
                  </div>
                  <StatusPill status={job.status} />
                </div>
                {job.nextAction && <p className="text-xs text-slate-600 mb-2 leading-relaxed">{job.nextAction}</p>}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">{formatDate(job.dateApplied)}</p>
                  <div className="flex items-center gap-1">
                    {ivCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-semibold">{ivCount} round{ivCount !== 1 ? 's' : ''}</span>
                    )}
                    <button onClick={() => setModal(job)} className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(job.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
              <InterviewsPanel job={job} onUpdateJob={handleUpdateJob} />
            </div>
          );
        })}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">No applications in this category.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Company / Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Next Action</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Applied</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <JobRow key={job.id} job={job} onEdit={(j) => setModal(j)} onDelete={handleDelete} onUpdateJob={handleUpdateJob} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* OPT reminder */}
      <div className="mt-5 bg-purple-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-purple-700 mb-1">OPT Reminder</p>
        <p className="text-xs text-purple-600 leading-relaxed">
          You must report any employer changes to your DSO within 10 days. Once you receive your EAD, you can legally begin working. Keep your job tracker up to date to stay compliant.
        </p>
      </div>

      {/* Modal */}
      {modal !== null && (
        <Modal
          title={modal === 'add' ? 'Add application' : 'Edit application'}
          onClose={() => setModal(null)}
        >
          <JobForm
            job={modal === 'add' ? null : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}

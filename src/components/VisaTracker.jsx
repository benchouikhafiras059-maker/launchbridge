import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from './Modal';
import { formatDate, generateId } from '../utils/helpers';

const STEP_STATUSES = ['pending', 'in-progress', 'done'];

function getStepConfig(status) {
  const map = {
    pending: { label: 'Pending', Icon: Circle, iconColor: 'text-slate-300', ringBg: 'bg-slate-100', pillBg: 'bg-slate-100', pillText: 'text-slate-500' },
    'in-progress': { label: 'In Progress', Icon: Clock, iconColor: 'text-blue-500', ringBg: 'bg-blue-50', pillBg: 'bg-blue-50', pillText: 'text-blue-600' },
    done: { label: 'Done', Icon: CheckCircle2, iconColor: 'text-emerald-500', ringBg: 'bg-emerald-50', pillBg: 'bg-emerald-50', pillText: 'text-emerald-600' },
  };
  return map[status] || map.pending;
}

function StepForm({ step, onSave, onClose }) {
  const [form, setForm] = useState(step || { title: '', status: 'pending', date: '', note: '' });
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, id: step?.id || generateId('os') });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Step title</label>
        <input
          type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Submit OPT application to ISSO"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required autoFocus
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            {STEP_STATUSES.map((s) => <option key={s} value={s}>{getStepConfig(s).label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Date</label>
          <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Notes</label>
        <input type="text" value={form.note} onChange={(e) => set('note', e.target.value)}
          placeholder="Any notes or reminders..."
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          {step ? 'Save changes' : 'Add step'}
        </button>
      </div>
    </form>
  );
}

export default function VisaTracker({ optSteps, setOptSteps, profile }) {
  const [modal, setModal] = useState(null);

  const done = optSteps.filter((s) => s.status === 'done').length;
  const percent = optSteps.length > 0 ? Math.round((done / optSteps.length) * 100) : 0;

  const cd = (() => {
    if (!profile?.graduationDate) return null;
    const grad = new Date(profile.graduationDate + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const optDeadline = new Date(grad); optDeadline.setDate(grad.getDate() - 90);
    const graceEnd = new Date(grad); graceEnd.setDate(grad.getDate() + 60);
    const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return {
      daysToGrad: Math.ceil((grad - today) / 86400000),
      daysToOptDeadline: Math.ceil((optDeadline - today) / 86400000),
      daysToGrace: Math.ceil((graceEnd - today) / 86400000),
      gradLabel: fmt(grad),
      optDeadlineLabel: fmt(optDeadline),
      graceLabel: fmt(graceEnd),
    };
  })();

  const handleSave = (step) => {
    setOptSteps((prev) => {
      const exists = prev.find((s) => s.id === step.id);
      return exists ? prev.map((s) => (s.id === step.id ? step : s)) : [...prev, step];
    });
  };

  const handleDelete = (id) => setOptSteps((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visa & OPT Tracker</h1>
          <p className="text-slate-500 text-sm mt-1">Track every step of your OPT application process.</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm"
        >
          <Plus size={15} /> Add step
        </button>
      </div>

      {/* OPT Timeline countdown */}
      {cd && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'OPT Apply By', value: cd.daysToOptDeadline, date: cd.optDeadlineLabel, urgent: cd.daysToOptDeadline <= 14 && cd.daysToOptDeadline >= 0 },
            { label: 'Until Graduation', value: cd.daysToGrad, date: cd.gradLabel, urgent: false },
            { label: 'Grace Period Ends', value: cd.daysToGrace, date: cd.graceLabel, urgent: false },
          ].map(({ label, value, date, urgent }) => (
            <div key={label} className={`rounded-2xl p-4 text-center ${urgent ? 'bg-red-50 border border-red-100' : 'bg-white border border-slate-100 shadow-sm'}`}>
              <p className={`text-2xl font-black ${urgent ? 'text-red-600' : value < 0 ? 'text-slate-300' : 'text-indigo-600'}`}>
                {value < 0 ? '—' : value}
              </p>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${urgent ? 'text-red-600' : 'text-slate-400'}`}>days</p>
              <p className={`text-xs font-semibold mt-1 ${urgent ? 'text-red-700' : 'text-slate-600'}`}>{label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Application Progress</p>
          <span className="text-sm font-bold text-slate-900">{done} of {optSteps.length} steps complete</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{percent}% complete</p>
      </div>

      {/* Key rules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-xs font-bold text-purple-700 mb-1">90-Day Window</p>
          <p className="text-[11px] text-purple-600 leading-relaxed">Apply no more than 90 days before your program end date</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-700 mb-1">60-Day Grace Period</p>
          <p className="text-[11px] text-blue-600 leading-relaxed">60 days after graduation to find employment or change status</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-xs font-bold text-amber-700 mb-1">EAD Required</p>
          <p className="text-[11px] text-amber-600 leading-relaxed">Cannot legally begin working before receiving your EAD card</p>
        </div>
      </div>

      {/* Step-by-step timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-5">OPT Steps</p>
        {optSteps.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No steps yet. Add your first OPT step.</p>
        ) : (
          <div>
            {optSteps.map((step, i) => {
              const cfg = getStepConfig(step.status);
              const { Icon } = cfg;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cfg.ringBg}`}>
                      <Icon size={16} className={cfg.iconColor} />
                    </div>
                    {i < optSteps.length - 1 && (
                      <div className="w-px flex-1 min-h-[24px] bg-slate-100 my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${step.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                          {step.title}
                        </p>
                        {step.date && <p className="text-xs text-slate-400 mt-0.5">{formatDate(step.date)}</p>}
                        {step.note && <p className="text-xs text-slate-500 mt-1 italic">{step.note}</p>}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${cfg.pillBg} ${cfg.pillText}`}>
                          {cfg.label}
                        </span>
                        <button onClick={() => setModal(step)} className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(step.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal !== null && (
        <Modal title={modal === 'add' ? 'Add OPT step' : 'Edit step'} onClose={() => setModal(null)}>
          <StepForm step={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

import { useState } from 'react';
import {
  LayoutDashboard, ListChecks, FolderOpen, Briefcase, NotebookPen,
  ShieldCheck, Wallet, Home, Users, Settings, CalendarDays,
} from 'lucide-react';
import Modal from './Modal';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'timeline', label: 'Timeline', icon: ListChecks },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'jobs', label: 'Job Tracker', icon: Briefcase },
  { id: 'visa', label: 'Visa & OPT', icon: ShieldCheck },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'housing', label: 'Housing', icon: Home },
  { id: 'network', label: 'Network', icon: Users },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
];

const FIELDS_OF_STUDY = [
  'UX / Product Design', 'Computer Science', 'Business / MBA',
  'Fine Arts', 'Architecture', 'Data Science', 'Other',
];
const VISA_TYPES = ['F-1 Student', 'J-1 Exchange Visitor', 'Other'];
const OPT_STATUSES = ['Planning to apply', 'Application in progress', 'EAD received'];

function ProfileModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState({ ...profile });
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Full name *</label>
          <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required autoFocus />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">University</label>
          <input type="text" value={form.university} onChange={(e) => set('university', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Field of study</label>
          <select value={form.field} onChange={(e) => set('field', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            <option value="">Select...</option>
            {FIELDS_OF_STUDY.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Graduation date</label>
          <input type="date" value={form.graduationDate} onChange={(e) => set('graduationDate', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Country of citizenship</label>
          <input type="text" value={form.country} onChange={(e) => set('country', e.target.value)}
            placeholder="e.g. Tunisia"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Visa type</label>
          <select value={form.visaType} onChange={(e) => set('visaType', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            {VISA_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">OPT status</label>
          <select value={form.optStatus} onChange={(e) => set('optStatus', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            {OPT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save changes</button>
      </div>
    </form>
  );
}

export default function Sidebar({ activePage, onNavigate, profile, onUpdateProfile, assistantOpen, onToggleAssistant, isOpen, onClose, badges = {} }) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const firstName = profile?.name?.split(' ')[0] || 'You';
  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <aside className={`fixed left-0 top-0 w-56 h-screen bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">LB</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-tight">LaunchBridge</p>
            <p className="text-[10px] text-slate-400 leading-tight">Post-Grad Transition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activePage === id;
          const badge = badges[id];
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={16} className={active ? 'text-indigo-600' : 'text-slate-400'} />
              <span className="flex-1 text-left">{label}</span>
              {badge > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-100 px-3 py-3 space-y-1">
        {/* Profile */}
        <button
          onClick={() => setShowProfileModal(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">{firstName}</p>
            <p className="text-[10px] text-slate-400 truncate">{profile?.university || 'Edit profile'}</p>
          </div>
          <Settings size={13} className="text-slate-300 flex-shrink-0" />
        </button>
      </div>

      {showProfileModal && (
        <Modal title="Edit Profile" onClose={() => setShowProfileModal(false)} maxWidth="max-w-xl">
          <ProfileModal
            profile={profile}
            onSave={onUpdateProfile}
            onClose={() => setShowProfileModal(false)}
          />
        </Modal>
      )}
    </aside>
  );
}

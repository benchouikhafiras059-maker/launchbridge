import { useState } from 'react';
import { Plus, Pencil, Trash2, Calendar, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import { generateId, formatDate, getDaysUntil } from '../utils/helpers';

const HOW_OPTIONS = ['LinkedIn', 'Career Fair', 'Class', 'Referral', 'Cold Outreach', 'Event', 'Other'];

function ContactCard({ contact, onEdit, onDelete }) {
  const followUpDays = contact.followUp ? getDaysUntil(contact.followUp) : null;
  const overdue = followUpDays !== null && followUpDays < 0;
  const soon = followUpDays !== null && followUpDays >= 0 && followUpDays <= 3;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 ${overdue ? 'border-red-100' : 'border-slate-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-indigo-600">{contact.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
            <p className="text-xs text-slate-500">{contact.role}{contact.role && contact.company ? ' · ' : ''}{contact.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(contact)} className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(contact.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          {contact.how && (
            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">{contact.how}</span>
          )}
          {contact.lastContact && (
            <span className="text-[11px] text-slate-400">Last contact: {formatDate(contact.lastContact)}</span>
          )}
        </div>
        {contact.followUp && (
          <div className={`flex items-center gap-1 ${overdue ? 'text-red-500' : soon ? 'text-amber-500' : 'text-slate-400'}`}>
            {overdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
            <span className="text-[11px] font-medium">
              {overdue
                ? `Follow-up overdue (${Math.abs(followUpDays)}d ago)`
                : soon
                ? `Follow up soon — ${formatDate(contact.followUp)}`
                : `Follow up ${formatDate(contact.followUp)}`}
            </span>
          </div>
        )}
        {contact.notes && (
          <p className="text-xs text-slate-500 italic leading-relaxed">{contact.notes}</p>
        )}
      </div>
    </div>
  );
}

function ContactForm({ contact, onSave, onClose }) {
  const [form, setForm] = useState(
    contact || { name: '', company: '', role: '', how: 'LinkedIn', lastContact: '', followUp: '', notes: '' }
  );
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, id: contact?.id || generateId('c') });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Full name</label>
        <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Sarah Kim" required autoFocus
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Company</label>
          <input type="text" value={form.company} onChange={(e) => set('company', e.target.value)}
            placeholder="e.g. Google"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Role</label>
          <input type="text" value={form.role} onChange={(e) => set('role', e.target.value)}
            placeholder="e.g. UX Designer"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">How you met</label>
          <select value={form.how} onChange={(e) => set('how', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            {HOW_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Last contact</label>
          <input type="date" value={form.lastContact} onChange={(e) => set('lastContact', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Follow-up date</label>
          <input type="date" value={form.followUp} onChange={(e) => set('followUp', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Notes</label>
        <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
          placeholder="How you know them, what you discussed, next steps..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          {contact ? 'Save changes' : 'Add contact'}
        </button>
      </div>
    </form>
  );
}

export default function NetworkContacts({ contacts, setContacts }) {
  const [modal, setModal] = useState(null);

  const overdue = contacts.filter((c) => c.followUp && getDaysUntil(c.followUp) < 0).length;
  const thisWeek = contacts.filter((c) => {
    const d = c.followUp ? getDaysUntil(c.followUp) : null;
    return d !== null && d >= 0 && d <= 7;
  }).length;

  const handleSave = (contact) => {
    setContacts((prev) => {
      const exists = prev.find((c) => c.id === contact.id);
      return exists ? prev.map((c) => (c.id === contact.id ? contact : c)) : [...prev, contact];
    });
  };
  const handleDelete = (id) => setContacts((prev) => prev.filter((c) => c.id !== id));

  const sorted = [...contacts].sort((a, b) => {
    const da = a.followUp ? getDaysUntil(a.followUp) : 9999;
    const db = b.followUp ? getDaysUntil(b.followUp) : 9999;
    return da - db;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Network & Contacts</h1>
          <p className="text-slate-500 text-sm mt-1">Stay on top of your professional relationships.</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm"
        >
          <Plus size={15} /> Add contact
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{contacts.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total contacts</p>
        </div>
        <div className={`rounded-2xl border shadow-sm p-4 text-center ${overdue > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'}`}>
          <p className={`text-2xl font-bold ${overdue > 0 ? 'text-red-600' : 'text-slate-900'}`}>{overdue}</p>
          <p className={`text-xs mt-1 ${overdue > 0 ? 'text-red-500' : 'text-slate-500'}`}>Follow-ups overdue</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{thisWeek}</p>
          <p className="text-xs text-slate-500 mt-1">Follow-ups this week</p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No contacts yet. Start building your network!</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sorted.map((contact) => (
            <ContactCard key={contact.id} contact={contact} onEdit={setModal} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {modal !== null && (
        <Modal title={modal === 'add' ? 'Add contact' : 'Edit contact'} onClose={() => setModal(null)} maxWidth="max-w-xl">
          <ContactForm contact={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

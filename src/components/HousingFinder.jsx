import { useState } from 'react';
import { Plus, Pencil, Trash2, Home, BedDouble } from 'lucide-react';
import Modal from './Modal';
import { generateId } from '../utils/helpers';

const APARTMENT_STATUSES = ['interested', 'toured', 'applied', 'waitlisted', 'rejected', 'secured'];

function getAptStatusConfig(status) {
  const map = {
    interested: { label: 'Interested', bg: 'bg-slate-100', text: 'text-slate-600' },
    toured: { label: 'Toured', bg: 'bg-blue-50', text: 'text-blue-600' },
    applied: { label: 'Applied', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    waitlisted: { label: 'Waitlisted', bg: 'bg-amber-50', text: 'text-amber-700' },
    rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-500' },
    secured: { label: 'Secured', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  };
  return map[status] || map.interested;
}

function ApartmentCard({ apt, onEdit, onDelete }) {
  const cfg = getAptStatusConfig(apt.status);
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 ${apt.status === 'secured' ? 'border-emerald-200' : 'border-slate-100'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{apt.name}</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{apt.address}</p>
        </div>
        <span className={`ml-2 text-[11px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <span className="text-base font-bold text-slate-800">${apt.rent.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span></span>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <BedDouble size={12} className="text-slate-300" />
          {apt.beds === 0 ? 'Studio' : `${apt.beds} bed`}
        </span>
      </div>

      {apt.notes && <p className="text-xs text-slate-500 italic mb-3 leading-relaxed">{apt.notes}</p>}

      <div className="flex items-center gap-1 justify-end">
        <button onClick={() => onEdit(apt)} className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
          <Pencil size={13} />
        </button>
        <button onClick={() => onDelete(apt.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function ApartmentForm({ apt, onSave, onClose }) {
  const [form, setForm] = useState(
    apt ? { ...apt, rent: String(apt.rent) } : { name: '', address: '', rent: '', beds: 1, status: 'interested', notes: '' }
  );
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const rent = parseFloat(form.rent);
    if (!form.name.trim() || isNaN(rent)) return;
    onSave({ ...form, rent, id: apt?.id || generateId('a') });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Building / Apartment name</label>
        <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. The Meridian" required autoFocus
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Address</label>
        <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)}
          placeholder="Street, City, State"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Monthly rent ($)</label>
          <input type="number" value={form.rent} onChange={(e) => set('rent', e.target.value)}
            placeholder="0" min="0" required
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Bedrooms</label>
          <select value={form.beds} onChange={(e) => set('beds', parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 0 ? 'Studio' : `${n} bed`}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
        <select value={form.status} onChange={(e) => set('status', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          {APARTMENT_STATUSES.map((s) => <option key={s} value={s}>{getAptStatusConfig(s).label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Notes</label>
        <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)}
          placeholder="Notes about this apartment..."
          rows={2}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          {apt ? 'Save changes' : 'Add apartment'}
        </button>
      </div>
    </form>
  );
}

export default function HousingFinder({ apartments, setApartments }) {
  const [modal, setModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = statusFilter === 'all' ? apartments : apartments.filter((a) => a.status === statusFilter);
  const counts = APARTMENT_STATUSES.reduce((acc, s) => {
    acc[s] = apartments.filter((a) => a.status === s).length;
    return acc;
  }, {});

  const handleSave = (apt) => {
    setApartments((prev) => {
      const exists = prev.find((a) => a.id === apt.id);
      return exists ? prev.map((a) => (a.id === apt.id ? apt : a)) : [...prev, apt];
    });
  };
  const handleDelete = (id) => setApartments((prev) => prev.filter((a) => a.id !== id));

  const secured = apartments.find((a) => a.status === 'secured');

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Housing Finder</h1>
          <p className="text-slate-500 text-sm mt-1">Track apartments you're considering for your move.</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm"
        >
          <Plus size={15} /> Add apartment
        </button>
      </div>

      {secured && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Home size={15} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800">You've secured housing!</p>
            <p className="text-xs text-emerald-600">{secured.name} — ${secured.rent.toLocaleString()}/mo</p>
          </div>
        </div>
      )}

      {/* Status filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          All ({apartments.length})
        </button>
        {APARTMENT_STATUSES.filter((s) => counts[s] > 0).map((s) => {
          const cfg = getAptStatusConfig(s);
          return (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${statusFilter === s ? `${cfg.bg} ${cfg.text} ring-1 ring-current ring-opacity-40` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {cfg.label} ({counts[s]})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No apartments in this category.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} onEdit={setModal} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {modal !== null && (
        <Modal title={modal === 'add' ? 'Add apartment' : 'Edit apartment'} onClose={() => setModal(null)}>
          <ApartmentForm apt={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

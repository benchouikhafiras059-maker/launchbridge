import { useState } from 'react';
import { Plus, Check, Pencil, Trash2 } from 'lucide-react';
import Modal from './Modal';
import {
  getCategoryConfig,
  getStatusConfig,
  getPriorityConfig,
  getDaysUntil,
  formatDate,
  generateId,
} from '../utils/helpers';

const CATEGORIES = ['all', 'visa', 'job', 'housing', 'finances', 'networking', 'personal'];
const STATUSES = ['all', 'not-started', 'in-progress', 'done'];

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const cat = getCategoryConfig(task.category);
  const pri = getPriorityConfig(task.priority);
  const status = getStatusConfig(task.status);
  const days = getDaysUntil(task.deadline);
  const overdue = days !== null && days < 0 && task.status !== 'done';
  const done = task.status === 'done';

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
        done ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 shadow-sm'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center transition-colors ${
          done
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-300 hover:border-indigo-400'
        }`}
      >
        {done && <Check size={11} className="text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug ${done ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${cat.bg} ${cat.text}`}>
            {cat.label}
          </span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${pri.bg} ${pri.text}`}>
            {pri.label}
          </span>
          <span
            className={`text-[11px] font-medium ${
              overdue ? 'text-red-500' : done ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {overdue ? `⚠ Overdue ${Math.abs(days)}d` : days === 0 ? 'Due today' : formatDate(task.deadline)}
          </span>
        </div>
      </div>

      {/* Status + Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${status.bg} ${status.text}`}>
          {status.label}
        </span>
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function TaskForm({ task, onSave, onClose }) {
  const [form, setForm] = useState(
    task || { title: '', category: 'visa', deadline: '', priority: 'medium', status: 'not-started' }
  );

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, id: task?.id || generateId('t') });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Task title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="What needs to get done?"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            {['visa', 'job', 'housing', 'finances', 'networking', 'personal'].map((c) => (
              <option key={c} value={c}>{getCategoryConfig(c).label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => set('priority', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Deadline</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {task ? 'Save changes' : 'Add task'}
        </button>
      </div>
    </form>
  );
}

export default function Timeline({ tasks, setTasks }) {
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(null); // null | 'add' | task object

  const filtered = tasks.filter((t) => {
    if (catFilter !== 'all' && t.category !== catFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aD = getDaysUntil(a.deadline) ?? 999;
    const bD = getDaysUntil(b.deadline) ?? 999;
    return aD - bD;
  });

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'done' ? 'not-started' : 'done' }
          : t
      )
    );
  };

  const handleSave = (task) => {
    setTasks((prev) => {
      const exists = prev.find((t) => t.id === task.id);
      return exists ? prev.map((t) => (t.id === task.id ? task : t)) : [...prev, task];
    });
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const doneCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Timeline</h1>
          <p className="text-slate-500 text-sm mt-1">
            {doneCount} of {tasks.length} tasks complete
          </p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm"
        >
          <Plus size={15} />
          Add task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((c) => {
            const cfg = c !== 'all' ? getCategoryConfig(c) : null;
            return (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  catFilter === c
                    ? c === 'all'
                      ? 'bg-slate-900 text-white'
                      : `${cfg.bg} ${cfg.text}`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'all' ? 'All' : cfg.label}
              </button>
            );
          })}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : getStatusConfig(s).label}
            </option>
          ))}
        </select>
      </div>

      {/* Task list */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">No tasks match the current filters.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={(t) => setModal(t)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modal !== null && (
        <Modal
          title={modal === 'add' ? 'Add new task' : 'Edit task'}
          onClose={() => setModal(null)}
        >
          <TaskForm
            task={modal === 'add' ? null : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}

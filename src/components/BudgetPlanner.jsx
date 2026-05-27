import { useState } from 'react';
import { Plus, Pencil, Trash2, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Modal from './Modal';
import { generateId } from '../utils/helpers';

function ItemForm({ item, type, onSave, onClose }) {
  const [form, setForm] = useState(
    item ? { ...item, amount: String(item.amount) } : { label: '', amount: '', type }
  );
  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.label.trim() || isNaN(amount) || amount <= 0) return;
    onSave({ ...form, amount, id: item?.id || generateId('b') });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Label</label>
        <input
          type="text" value={form.label} onChange={(e) => set('label', e.target.value)}
          placeholder={type === 'income' ? 'e.g. Monthly Salary' : 'e.g. Rent'}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required autoFocus
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">Amount ($/month)</label>
        <input
          type="number" value={form.amount} onChange={(e) => set('amount', e.target.value)}
          placeholder="0" min="0" step="0.01"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          required
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
        <button type="submit" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          {item ? 'Save changes' : 'Add item'}
        </button>
      </div>
    </form>
  );
}

function BudgetRow({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-700">{item.label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${item.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
          ${item.amount.toLocaleString()}
        </span>
        <button onClick={() => onEdit(item)} className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
          <Pencil size={13} />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function BudgetPlanner({ budgetItems, setBudgetItems }) {
  const [modal, setModal] = useState(null);

  const income = budgetItems.filter((i) => i.type === 'income');
  const expenses = budgetItems.filter((i) => i.type === 'expense');
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, i) => sum + i.amount, 0);
  const net = totalIncome - totalExpenses;

  const handleSave = (item) => {
    setBudgetItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [...prev, item];
    });
  };

  const handleDelete = (id) => setBudgetItems((prev) => prev.filter((i) => i.id !== id));

  const maxExpense = expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 1;

  const modalType = modal?.id ? modal.type : modal?.type;
  const modalItem = modal?.id ? modal : null;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Budget Planner</h1>
        <p className="text-slate-500 text-sm mt-1">Plan your monthly income and expenses post-graduation.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={15} className="text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Income</p>
          </div>
          <p className="text-2xl font-bold text-emerald-700">${totalIncome.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-500 mt-1">per month</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={15} className="text-red-500" />
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Expenses</p>
          </div>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
          <p className="text-[11px] text-red-400 mt-1">per month</p>
        </div>
        <div className={`${net >= 0 ? 'bg-indigo-50' : 'bg-orange-50'} rounded-2xl p-5`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={15} className={net >= 0 ? 'text-indigo-600' : 'text-orange-500'} />
            <p className={`text-xs font-semibold uppercase tracking-wider ${net >= 0 ? 'text-indigo-700' : 'text-orange-600'}`}>Net</p>
          </div>
          <p className={`text-2xl font-bold ${net >= 0 ? 'text-indigo-700' : 'text-orange-600'}`}>
            {net >= 0 ? '+' : ''}${net.toLocaleString()}
          </p>
          <p className={`text-[11px] mt-1 ${net >= 0 ? 'text-indigo-400' : 'text-orange-400'}`}>
            {net >= 0 ? 'monthly savings' : 'over budget'}
          </p>
        </div>
      </div>

      {/* Income & Expense columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Income</p>
            <button
              onClick={() => setModal({ type: 'income' })}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          {income.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No income items yet.</p>
          ) : (
            income.map((item) => <BudgetRow key={item.id} item={item} onEdit={setModal} onDelete={handleDelete} />)
          )}
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
            <span className="text-xs font-semibold text-slate-500">Total</span>
            <span className="text-xs font-bold text-emerald-600">${totalIncome.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expenses</p>
            <button
              onClick={() => setModal({ type: 'expense' })}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              <Plus size={13} /> Add
            </button>
          </div>
          {expenses.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No expense items yet.</p>
          ) : (
            expenses.map((item) => <BudgetRow key={item.id} item={item} onEdit={setModal} onDelete={handleDelete} />)
          )}
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
            <span className="text-xs font-semibold text-slate-500">Total</span>
            <span className="text-xs font-bold text-red-500">${totalExpenses.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Expense breakdown chart */}
      {expenses.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Expense Breakdown</p>
          <div className="space-y-3">
            {[...expenses].sort((a, b) => b.amount - a.amount).map((item) => (
              <div key={item.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-600">{item.label}</span>
                  <span className="text-xs font-semibold text-slate-700">${item.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${(item.amount / maxExpense) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal !== null && (
        <Modal title={modal.id ? 'Edit item' : `Add ${modal.type} item`} onClose={() => setModal(null)}>
          <ItemForm item={modalItem} type={modalType} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

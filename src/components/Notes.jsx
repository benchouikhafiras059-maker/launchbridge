import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { generateId, formatDate } from '../utils/helpers';

function NoteCard({ note, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const preview = note.content.length > 120 ? note.content.slice(0, 120) + '…' : note.content;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{note.title}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(note.date)}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-600 mt-3 leading-relaxed whitespace-pre-wrap">
        {expanded ? note.content : preview}
      </p>
      {note.content.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-indigo-600 hover:text-indigo-800 mt-2 font-medium"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

function NoteEditForm({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: note?.id || generateId('n'),
      title: title.trim(),
      content: content.trim(),
      date: note?.date || new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-indigo-200 shadow-sm p-5 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="w-full px-3 py-2 text-sm font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-900 placeholder-slate-400"
        required
        autoFocus
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your notes here — interview takeaways, advisor meeting notes, reminders…"
        rows={5}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-700 placeholder-slate-400 resize-none leading-relaxed"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg"
        >
          <X size={13} />
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Check size={13} />
          {note ? 'Save changes' : 'Add note'}
        </button>
      </div>
    </form>
  );
}

export default function Notes({ notes, setNotes }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleSave = (note) => {
    setNotes((prev) => {
      const exists = prev.find((n) => n.id === note.id);
      return exists ? prev.map((n) => (n.id === note.id ? note : n)) : [note, ...prev];
    });
    setShowAdd(false);
    setEditingNote(null);
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const sorted = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notes</h1>
          <p className="text-slate-500 text-sm mt-1">
            Capture interview takeaways, advisor meetings, and reminders.
          </p>
        </div>
        {!showAdd && !editingNote && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm"
          >
            <Plus size={15} />
            New note
          </button>
        )}
      </div>

      {/* Add note form */}
      {showAdd && (
        <div className="mb-5">
          <NoteEditForm onSave={handleSave} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {/* Notes list */}
      {sorted.length === 0 && !showAdd ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">No notes yet. Start by adding one above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((note) =>
            editingNote?.id === note.id ? (
              <NoteEditForm
                key={note.id}
                note={note}
                onSave={handleSave}
                onCancel={() => setEditingNote(null)}
              />
            ) : (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={(n) => { setShowAdd(false); setEditingNote(n); }}
                onDelete={handleDelete}
              />
            )
          )}
        </div>
      )}

      {/* Prompt */}
      {notes.length > 0 && (
        <div className="mt-6 bg-teal-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-teal-700 mb-1">Use this space</p>
          <p className="text-xs text-teal-600 leading-relaxed">
            Document every interview, informational call, and advisor conversation. These notes will help you spot patterns, remember follow-ups, and reflect on your progress.
          </p>
        </div>
      )}
    </div>
  );
}

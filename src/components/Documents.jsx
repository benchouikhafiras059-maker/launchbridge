import { useState, useRef } from 'react';
import { FileText, Plus, Trash2, Upload, CheckCircle2, AlertTriangle, Paperclip } from 'lucide-react';
import { getDocStatusConfig, generateId } from '../utils/helpers';

const DOC_STATUS_CYCLE = ['missing', 'in-progress', 'ready'];

const KEYWORD_MAP = [
  { keywords: ['passport'], match: ['passport'] },
  { keywords: ['i20', 'i-20', 'i_20'], match: ['i-20', 'i20'] },
  { keywords: ['opt', 'i765', 'i-765', 'receipt'], match: ['opt'] },
  { keywords: ['ead', 'employment authorization'], match: ['ead'] },
  { keywords: ['resume', 'cv', 'curriculum'], match: ['resume'] },
  { keywords: ['lease', 'rental', 'apartment', 'tenancy'], match: ['lease'] },
  { keywords: ['offer', 'employment letter', 'job offer'], match: ['offer'] },
  { keywords: ['insurance', 'health', 'medical'], match: ['insurance', 'health'] },
  { keywords: ['transcript', 'grades'], match: ['transcript'] },
  { keywords: ['social security', 'ssn', 'ss-5'], match: ['social security', 'ssn'] },
];

function detectDocument(filename, documents) {
  const normalized = filename.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/g, ' ');

  // First pass: match against actual document names in the list
  for (const doc of documents) {
    if (doc.status === 'ready') continue;
    const words = doc.name.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(' ').filter((w) => w.length > 2);
    if (words.some((w) => normalized.includes(w))) return doc;
  }

  // Second pass: keyword map
  for (const { keywords, match } of KEYWORD_MAP) {
    if (!keywords.some((kw) => normalized.includes(kw))) continue;
    const doc = documents.find(
      (d) => d.status !== 'ready' && match.some((m) => d.name.toLowerCase().includes(m))
    );
    if (doc) return doc;
  }

  return null;
}

function DocCard({ doc, onCycleStatus, onDelete }) {
  const cfg = getDocStatusConfig(doc.status);
  const nextStatus = DOC_STATUS_CYCLE[(DOC_STATUS_CYCLE.indexOf(doc.status) + 1) % DOC_STATUS_CYCLE.length];

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3 ${doc.uploadedFile ? 'border-emerald-100' : 'border-slate-100'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${doc.uploadedFile ? 'bg-emerald-50' : 'bg-slate-100'}`}>
            <FileText size={14} className={doc.uploadedFile ? 'text-emerald-500' : 'text-slate-500'} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 leading-tight">{doc.name}</p>
            {doc.uploadedFile && (
              <p className="text-[10px] text-emerald-500 mt-0.5 flex items-center gap-1">
                <Paperclip size={9} /> {doc.uploadedFile}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(doc.id)}
          className="p-1 text-slate-200 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-[11px] px-2 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
        <button
          onClick={() => onCycleStatus(doc.id, nextStatus)}
          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
        >
          Mark as {getDocStatusConfig(nextStatus).label}
        </button>
      </div>
    </div>
  );
}

export default function Documents({ documents, setDocuments }) {
  const [newDocName, setNewDocName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { success, docName, fileName } | null
  const fileInputRef = useRef(null);

  const ready = documents.filter((d) => d.status === 'ready').length;
  const inProgress = documents.filter((d) => d.status === 'in-progress').length;
  const missing = documents.filter((d) => d.status === 'missing').length;

  const handleCycleStatus = (id, nextStatus) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status: nextStatus } : d)));
  };

  const handleDelete = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    setDocuments((prev) => [
      ...prev,
      { id: generateId('d'), name: newDocName.trim(), status: 'missing' },
    ]);
    setNewDocName('');
    setShowAdd(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const matched = detectDocument(file.name, documents);
    if (matched) {
      setDocuments((prev) =>
        prev.map((d) => d.id === matched.id ? { ...d, status: 'ready', uploadedFile: file.name } : d)
      );
      setScanResult({ success: true, docName: matched.name, fileName: file.name });
    } else {
      setScanResult({ success: false, fileName: file.name });
    }
    setTimeout(() => setScanResult(null), 5000);
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track the status of your important documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 shadow-sm"
          >
            <Upload size={15} className="text-indigo-500" />
            Upload & Scan
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm"
          >
            <Plus size={15} />
            Add document
          </button>
        </div>
      </div>

      {/* Scan result banner */}
      {scanResult && (
        <div className={`flex items-start gap-3 p-4 rounded-xl mb-5 ${scanResult.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
          {scanResult.success
            ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            : <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />}
          <div>
            <p className={`text-sm font-semibold ${scanResult.success ? 'text-emerald-800' : 'text-amber-800'}`}>
              {scanResult.success
                ? `Detected: ${scanResult.docName} — marked as Ready`
                : "Couldn't identify document type"}
            </p>
            <p className={`text-xs mt-0.5 ${scanResult.success ? 'text-emerald-600' : 'text-amber-600'}`}>
              {scanResult.success
                ? `File "${scanResult.fileName}" was matched and attached.`
                : `"${scanResult.fileName}" didn't match any document. Try renaming it (e.g. "passport.pdf") or add the document manually.`}
            </p>
          </div>
        </div>
      )}


      {/* Summary bar */}
      <div className="flex gap-4 mb-6">
        <SummaryBadge label="Ready" count={ready} bg="bg-emerald-50" text="text-emerald-700" />
        <SummaryBadge label="In Progress" count={inProgress} bg="bg-amber-50" text="text-amber-700" />
        <SummaryBadge label="Missing" count={missing} bg="bg-red-50" text="text-red-600" />
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="flex gap-2 mb-5 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <input
            type="text"
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
            placeholder="Document name (e.g. Social Security Card)"
            className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(false)}
            className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Document grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {documents.map((doc) => (
          <DocCard
            key={doc.id}
            doc={doc}
            onCycleStatus={handleCycleStatus}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">No documents tracked yet.</p>
        </div>
      )}

      {/* Context note */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-blue-700 mb-1">For international students</p>
        <p className="text-xs text-blue-600 leading-relaxed">
          Your I-20, OPT receipt, and EAD card are time-sensitive immigration documents. Keep physical and digital copies in a safe location. Contact your ISSO office immediately if any of these are missing.
        </p>
      </div>
    </div>
  );
}

function SummaryBadge({ label, count, bg, text }) {
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl ${bg}`}>
      <span className={`text-lg font-bold ${text}`}>{count}</span>
      <span className={`text-xs font-medium ${text}`}>{label}</span>
    </div>
  );
}

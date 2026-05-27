import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const VISA_TYPES = ['F-1 Student', 'J-1 Exchange Visitor', 'Other'];
const OPT_STATUSES = ['Planning to apply', 'Application in progress', 'EAD received'];
const FIELDS_OF_STUDY = [
  'UX / Product Design', 'Computer Science', 'Business / MBA',
  'Fine Arts', 'Architecture', 'Data Science', 'Other',
];

const TOTAL_STEPS = 4; // 1-Profile, 2-Graduation, 3-Visa, welcome=0, done=4

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    university: '',
    field: '',
    graduationDate: '',
    country: '',
    visaType: 'F-1 Student',
    optStatus: 'Planning to apply',
  });

  const set = (field, val) => setProfile((p) => ({ ...p, [field]: val }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const progressPercent = step <= 0 ? 0 : step >= TOTAL_STEPS ? 100 : Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-bold text-sm">LB</span>
          </div>
          <span className="text-xl font-bold text-slate-900">LaunchBridge</span>
        </div>

        {/* Progress bar */}
        {step > 0 && step < TOTAL_STEPS + 1 && (
          <div className="mb-6">
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">Step {step} of {TOTAL_STEPS}</p>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <span className="text-3xl">🎓</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">Welcome to LaunchBridge</h1>
              <p className="text-slate-500 text-sm leading-relaxed mb-2">
                Your all-in-one dashboard for navigating life after graduation as an international student.
              </p>
              <p className="text-slate-400 text-xs leading-relaxed mb-7">
                Track your OPT application, job search, housing, budget, documents, and professional network — all in one place.
              </p>
              <div className="grid grid-cols-2 gap-2.5 mb-8 text-left">
                {[
                  { icon: '🛂', label: 'Visa & OPT tracker' },
                  { icon: '💼', label: 'Job applications' },
                  { icon: '🏠', label: 'Housing search' },
                  { icon: '💰', label: 'Budget planner' },
                  { icon: '📄', label: 'Document checklist' },
                  { icon: '🤝', label: 'Network & contacts' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
                    <span className="text-base">{icon}</span>
                    <span className="text-xs font-medium text-slate-600">{label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={next}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition-colors"
              >
                Get Started <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* Step 1: Profile */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Your Profile</h2>
              <p className="text-sm text-slate-500 mb-5">Tell us a bit about yourself.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Full name *</label>
                  <input
                    type="text" value={profile.name} onChange={(e) => set('name', e.target.value)}
                    placeholder="e.g. Firas Benchouikha" autoFocus
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email" value={profile.email} onChange={(e) => set('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">University</label>
                  <input
                    type="text" value={profile.university} onChange={(e) => set('university', e.target.value)}
                    placeholder="e.g. SCAD"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Field of study</label>
                  <select
                    value={profile.field} onChange={(e) => set('field', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  >
                    <option value="">Select field...</option>
                    {FIELDS_OF_STUDY.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={back} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1">
                  <ArrowLeft size={15} /> Back
                </button>
                <button
                  onClick={next} disabled={!profile.name.trim()}
                  className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 transition-colors"
                >
                  Next <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Graduation */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Graduation Details</h2>
              <p className="text-sm text-slate-500 mb-5">This helps us personalize your OPT timeline.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Graduation date</label>
                  <input
                    type="date" value={profile.graduationDate} onChange={(e) => set('graduationDate', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Country of citizenship</label>
                  <input
                    type="text" value={profile.country} onChange={(e) => set('country', e.target.value)}
                    placeholder="e.g. Tunisia"
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div className="bg-blue-50 rounded-xl p-3.5">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Why we ask</p>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Your graduation date determines the OPT application window (up to 90 days before) and the 60-day grace period after graduation.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={back} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1">
                  <ArrowLeft size={15} /> Back
                </button>
                <button onClick={next} className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-1 transition-colors">
                  Next <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Visa */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Visa & OPT Status</h2>
              <p className="text-sm text-slate-500 mb-5">We'll personalize your tracker based on this.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Current visa type</label>
                  <div className="space-y-2">
                    {VISA_TYPES.map((v) => (
                      <button
                        key={v} type="button" onClick={() => set('visaType', v)}
                        className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors text-left ${
                          profile.visaType === v
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">OPT application status</label>
                  <select
                    value={profile.optStatus} onChange={(e) => set('optStatus', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                  >
                    {OPT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={back} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 flex items-center justify-center gap-1">
                  <ArrowLeft size={15} /> Back
                </button>
                <button onClick={next} className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 flex items-center justify-center gap-1 transition-colors">
                  Almost done <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                You're all set, {profile.name.split(' ')[0] || 'there'}!
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Your LaunchBridge dashboard is ready. Here's what to focus on first:
              </p>
              <div className="space-y-3 text-left mb-8">
                {[
                  { icon: '🛂', title: 'Visa & OPT Tracker', desc: 'Complete your OPT application steps before the deadline' },
                  { icon: '📄', title: 'Documents', desc: 'Upload and verify your key immigration documents' },
                  { icon: '💼', title: 'Job Tracker', desc: 'Start logging your applications and follow-ups' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3.5">
                    <span className="text-lg leading-none mt-0.5">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onComplete(profile)}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-colors"
              >
                Enter Dashboard
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          All your data is stored locally on your device. Nothing is sent to any server.
        </p>
      </div>
    </div>
  );
}

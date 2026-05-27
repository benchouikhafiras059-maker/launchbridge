import { useState } from 'react';
import { Sparkles, X, Menu } from 'lucide-react';
import { getDaysUntil } from './utils/helpers';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import Documents from './components/Documents';
import JobTracker from './components/JobTracker';
import Notes from './components/Notes';
import CalendarView from './components/CalendarView';
import VisaTracker from './components/VisaTracker';
import BudgetPlanner from './components/BudgetPlanner';
import HousingFinder from './components/HousingFinder';
import NetworkContacts from './components/NetworkContacts';
import AssistantPanel from './components/AssistantPanel';
import Onboarding from './components/Onboarding';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  initialTasks,
  initialDocuments,
  initialJobs,
  initialNotes,
  initialOptSteps,
  initialBudgetItems,
  initialApartments,
  initialContacts,
} from './data/sampleData';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  calendar: 'Calendar',
  timeline: 'Timeline',
  documents: 'Documents',
  jobs: 'Job Tracker',
  visa: 'Visa & OPT',
  budget: 'Budget',
  housing: 'Housing',
  network: 'Network',
  notes: 'Notes',
};

export default function App() {
  const [profile, setProfile] = useLocalStorage('lb_profile', null);
  const [activePage, setActivePage] = useState('dashboard');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [tasks, setTasks] = useLocalStorage('lb_tasks', initialTasks);
  const [documents, setDocuments] = useLocalStorage('lb_documents', initialDocuments);
  const [jobs, setJobs] = useLocalStorage('lb_jobs', initialJobs);
  const [notes, setNotes] = useLocalStorage('lb_notes', initialNotes);
  const [optSteps, setOptSteps] = useLocalStorage('lb_optSteps', initialOptSteps);
  const [budgetItems, setBudgetItems] = useLocalStorage('lb_budgetItems', initialBudgetItems);
  const [apartments, setApartments] = useLocalStorage('lb_apartments', initialApartments);
  const [contacts, setContacts] = useLocalStorage('lb_contacts', initialContacts);

  if (!profile) {
    return <Onboarding onComplete={setProfile} />;
  }

  const sharedProps = { tasks, setTasks, documents, setDocuments, jobs, setJobs, notes, setNotes };

  const badges = {
    timeline: tasks.filter((t) => t.status !== 'done' && getDaysUntil(t.deadline) < 0).length,
    documents: documents.filter((d) => d.status === 'missing').length,
    network: contacts.filter((c) => c.followUp && getDaysUntil(c.followUp) < 0).length,
    jobs: jobs.filter((j) => j.status === 'follow-up').length,
  };

  const pages = {
    dashboard: <Dashboard {...sharedProps} profile={profile} />,
    calendar: <CalendarView tasks={tasks} optSteps={optSteps} contacts={contacts} jobs={jobs} />,
    timeline: <Timeline {...sharedProps} />,
    documents: <Documents {...sharedProps} />,
    jobs: <JobTracker {...sharedProps} />,
    notes: <Notes {...sharedProps} />,
    visa: <VisaTracker optSteps={optSteps} setOptSteps={setOptSteps} profile={profile} />,
    budget: <BudgetPlanner budgetItems={budgetItems} setBudgetItems={setBudgetItems} />,
    housing: <HousingFinder apartments={apartments} setApartments={setApartments} />,
    network: <NetworkContacts contacts={contacts} setContacts={setContacts} />,
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">LB</span>
          </div>
          <span className="text-sm font-bold text-slate-900">{PAGE_TITLES[activePage]}</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        profile={profile}
        onUpdateProfile={setProfile}
        onSignOut={() => setProfile(null)}
        assistantOpen={assistantOpen}
        onToggleAssistant={() => setAssistantOpen((v) => !v)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        badges={badges}
      />

      <main className="flex-1 overflow-y-auto md:ml-56 pt-14 md:pt-0">
        {pages[activePage]}
      </main>

      {/* Floating assistant panel */}
      {assistantOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-20 md:right-5 md:w-80 md:h-[520px] bg-white md:rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500" />
              <span className="text-sm font-semibold text-slate-800">Focus Assistant</span>
            </div>
            <button
              onClick={() => setAssistantOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AssistantPanel tasks={tasks} documents={documents} jobs={jobs} />
          </div>
        </div>
      )}

      {/* Floating FAB */}
      <button
        onClick={() => setAssistantOpen((v) => !v)}
        className={`fixed bottom-5 right-5 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50 transition-colors ${
          assistantOpen ? 'bg-slate-700 hover:bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {assistantOpen ? <X size={18} className="text-white" /> : <Sparkles size={18} className="text-white" />}
      </button>
    </div>
  );
}

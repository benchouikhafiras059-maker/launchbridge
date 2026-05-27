import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCategoryConfig, formatDate } from '../utils/helpers';

const DOT_COLORS = {
  task: 'bg-indigo-400',
  opt: 'bg-purple-400',
  contact: 'bg-rose-400',
  job: 'bg-blue-400',
  interview: 'bg-violet-500',
};

const TYPE_LABELS = {
  task: 'Task',
  opt: 'OPT Step',
  contact: 'Follow-up',
  job: 'Applied',
  interview: 'Interview',
};

const TYPE_BG = {
  task: 'bg-indigo-50 text-indigo-700',
  opt: 'bg-purple-50 text-purple-700',
  contact: 'bg-rose-50 text-rose-700',
  job: 'bg-blue-50 text-blue-600',
  interview: 'bg-violet-50 text-violet-700',
};

function buildEvents(tasks, optSteps, contacts, jobs) {
  const map = {};
  const add = (dateStr, event) => {
    if (!dateStr) return;
    const key = dateStr.slice(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(event);
  };

  tasks.forEach((t) => {
    if (t.deadline) add(t.deadline, { type: 'task', label: t.title, sub: getCategoryConfig(t.category).label, done: t.status === 'done' });
  });
  optSteps.forEach((s) => {
    if (s.date) add(s.date, { type: 'opt', label: s.title, done: s.status === 'done' });
  });
  contacts.forEach((c) => {
    if (c.followUp) add(c.followUp, { type: 'contact', label: `Follow up: ${c.name}`, sub: c.company });
  });
  jobs.forEach((j) => {
    if (j.dateApplied) add(j.dateApplied, { type: 'job', label: `${j.company} — ${j.role}` });
    (j.interviews || []).forEach((iv) => {
      if (iv.date) add(iv.date, { type: 'interview', label: `${j.company}: Round ${iv.round} ${iv.type}`, sub: iv.outcome });
    });
  });

  return map;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarView({ tasks, optSteps, contacts, jobs }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );

  const events = buildEvents(tasks, optSteps, contacts, jobs);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const toKey = (d) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const selectedEvents = events[selectedDate] || [];

  const allEventTypes = [...new Set(Object.values(events).flat().map(e => e.type))];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
        <p className="text-slate-500 text-sm mt-1">All your deadlines, follow-ups, and interviews in one view.</p>
      </div>

      {/* Legend */}
      <div className="flex gap-3 flex-wrap mb-5">
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${DOT_COLORS[type]}`} />
            <span className="text-xs text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          {/* Month header */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-base font-bold text-slate-900">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px">
            {Array.from({ length: totalCells }).map((_, i) => {
              const dayNum = i - firstDay + 1;
              const isValid = dayNum >= 1 && dayNum <= daysInMonth;
              const key = isValid ? toKey(dayNum) : null;
              const dayEvents = key ? (events[key] || []) : [];
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;

              return (
                <button
                  key={i}
                  disabled={!isValid}
                  onClick={() => key && setSelectedDate(key)}
                  className={`min-h-[52px] p-1.5 rounded-xl flex flex-col items-center transition-colors ${
                    !isValid ? 'opacity-0 pointer-events-none' :
                    isSelected ? 'bg-indigo-600' :
                    isToday ? 'bg-indigo-50' :
                    'hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-semibold mb-1 ${
                    isSelected ? 'text-white' : isToday ? 'text-indigo-600' : 'text-slate-700'
                  }`}>
                    {isValid ? dayNum : ''}
                  </span>
                  {isValid && dayEvents.length > 0 && (
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {[...new Set(dayEvents.map(e => e.type))].slice(0, 3).map((type) => (
                        <div
                          key={type}
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/80' : DOT_COLORS[type]}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event list for selected day */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col">
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {selectedDate === todayKey ? 'Today' : formatDate(selectedDate)}
            </p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {selectedEvents.length === 0 ? 'Nothing scheduled' : `${selectedEvents.length} event${selectedEvents.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {selectedEvents.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-slate-400 text-center">No events on this day.<br />Click a day to see its events.</p>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1 overflow-y-auto">
              {selectedEvents.map((ev, i) => (
                <div key={i} className={`rounded-xl p-3 ${ev.done ? 'opacity-50' : ''}`} style={{ background: '#f8fafc' }}>
                  <div className="flex items-start gap-2.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${DOT_COLORS[ev.type]}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold text-slate-800 leading-snug ${ev.done ? 'line-through' : ''}`}>{ev.label}</p>
                      {ev.sub && <p className="text-[10px] text-slate-400 mt-0.5">{ev.sub}</p>}
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0 ${TYPE_BG[ev.type]}`}>
                      {TYPE_LABELS[ev.type]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Monthly summary */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-medium mb-1.5">{MONTHS[month]} overview</p>
            <div className="space-y-1">
              {Object.entries(TYPE_LABELS).map(([type, label]) => {
                const count = Object.entries(events).filter(([key]) => {
                  const d = new Date(key + 'T00:00:00');
                  return d.getMonth() === month && d.getFullYear() === year;
                }).reduce((sum, [, evs]) => sum + evs.filter(e => e.type === type).length, 0);
                if (count === 0) return null;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[type]}`} />
                      <span className="text-[11px] text-slate-500">{label}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

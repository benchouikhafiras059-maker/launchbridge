# LaunchBridge

A post-graduation transition dashboard built for Nico Fertonani — an international student from Argentina navigating visa deadlines, job applications, housing, and the full complexity of life after college, all in one place.

**Live app:** [benchouikhafiras059-maker.github.io/launchbridge](https://benchouikhafiras059-maker.github.io/launchbridge/)

---

## Project Documentation

| Document | Description |
|---|---|
| [Design Argument](docs/design-argument.md) | Who Nico is, what's broken for him, what "helped" looks like, and why this tool exists |
| [Research Documentation](docs/research.md) | Interview notes, quotes, observed pain points, and environment context |
| [Platform Rationale](docs/platform-rationale.md) | Why a React web app — and why not a mobile app, extension, or native build |
| [User Testing Evidence](docs/user-testing.md) | What happened when Nico used the prototype — what he reached for, what he ignored, what surprised him |
| [System Architecture](docs/architecture.md) | Full Mermaid diagram — inputs, state, computed logic, and outputs |
| [AI Direction Log](docs/ai-direction-log.md) | 7 entries — what I asked AI to do, what it produced, what I kept and changed |
| [Records of Resistance](docs/records-of-resistance.md) | 3 documented moments of rejecting or significantly revising AI output |
| [Five Questions Reflection](docs/five-questions.md) | Design cycle reflection — who, what, research, AI, and what I'd do differently |
| [Post-Mortem](docs/post-mortem.md) | What worked, what failed, and what designing for a real person taught me |

---

## The Problem

Nico said it directly:

> "The hardest part is that everything is connected, but it's not in one place. I have to think about jobs, visa deadlines, documents, money, and where I'm going to live, but I don't always know what to prioritize first."

LaunchBridge is built around that sentence. One place. Connected. Prioritized.

---

## What It Does

| Problem | Solution |
|---|---|
| Deadlines scattered across email, portals, and notes | Timeline with all tasks in one view, sorted by urgency |
| Uncertainty about what to do first | Focus Assistant surfaces top 3 priorities by deadline and urgency |
| OPT application window easy to miss | OPT Countdown banner — days until deadline, live on the dashboard |
| Document status tracked in memory | Documents tracker with clear status per item |
| Job applications tracked informally | Job Tracker with full pipeline and interview log |
| No sense of overall progress | Transition Readiness Score (0–100) across tasks, documents, and applications |

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. All data lives in localStorage under the `lb_` prefix. To reset to sample data, clear localStorage in DevTools → Application → Local Storage.

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation
│   ├── Dashboard.jsx        # Readiness score · OPT countdown · urgent tasks
│   ├── Timeline.jsx         # All tasks sorted by deadline
│   ├── Documents.jsx        # Document status tracker
│   ├── JobTracker.jsx       # Application pipeline + interview log
│   ├── VisaTracker.jsx      # OPT step-by-step checklist
│   ├── BudgetPlanner.jsx    # Income vs. expenses
│   ├── HousingFinder.jsx    # Apartment options and status
│   ├── NetworkContacts.jsx  # Contacts + follow-up tracking
│   ├── Notes.jsx            # Freeform notes
│   ├── AssistantPanel.jsx   # Rule-based focus panel (no LLM)
│   ├── Onboarding.jsx       # First-run profile setup
│   └── Modal.jsx            # Shared modal overlay
├── data/
│   └── sampleData.js        # Pre-populated realistic sample content
├── hooks/
│   └── useLocalStorage.js   # Persistent state hook
└── utils/
    └── helpers.js           # Scoring, priority logic, formatting
docs/
├── design-argument.md
├── research.md
├── platform-rationale.md
├── user-testing.md
├── architecture.md
├── ai-direction-log.md
├── records-of-resistance.md
├── five-questions.md
└── post-mortem.md
```

---

*Built for SCAD AI 201 — Persons Required. Spring 2026. Designed for Nico Fertonani.*

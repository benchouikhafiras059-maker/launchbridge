# LaunchBridge

A post-graduation transition dashboard built for graduating international students navigating visa deadlines, job applications, relocation, and life after college — all in one calm, organized place.

---

## Design Argument

Most tools for recent graduates are either too generic (to-do apps, spreadsheets) or too narrow (only job trackers, only visa checklists). International students face a uniquely layered transition: they must manage time-sensitive immigration deadlines, a high-stakes job search, relocation planning, and personal adjustment — simultaneously, and with consequences for missing any single step.

LaunchBridge is designed around one principle: **the user does not need more information, they need clarity**. The app does not give advice — it surfaces what already exists (the user's tasks, documents, applications) in a structure that makes priorities obvious and progress visible.

The design uses calm colors, generous spacing, and a hierarchical card layout to reduce cognitive load. The right-side Assistant Panel uses rule-based logic to surface the top 3 things to act on, so the user never has to decide where to start from a blank page.

---

## Platform Rationale

**React + Vite + Tailwind CSS**: React's component model maps cleanly to the modular sections of this dashboard (each page is a discrete component that shares centralized state). Vite provides fast local development with no configuration overhead. Tailwind CSS enables rapid, consistent styling without writing custom CSS for every element.

**localStorage (no backend)**: For a single-user tool used during a 3–6 month life transition, local persistence is sufficient and eliminates the friction of accounts or servers. All data is private by default and persists across browser sessions.

**No AI API**: The Focus Assistant uses deterministic sorting logic (overdue → soonest deadline → highest priority) rather than an LLM API. This keeps the app free to run, fast, and reliable — and is sufficient for the core use case.

---

## How the App Helps the User

The primary user is a graduating international student preparing for the post-college transition. Their specific challenges:

| Problem | LaunchBridge Solution |
|---|---|
| Important deadlines spread across email, notes, school portals | Timeline with all tasks in one view, filterable by category |
| Uncertainty about which task to prioritize | Focus Assistant panel surfaces top 3 priorities with reason |
| No clear view of immigration document status | Documents tracker with simple 3-state status system |
| Job applications tracked in a spreadsheet or memory | Job Tracker with full pipeline from Saved → Offer |
| Forgetting what happened in interviews or advisor meetings | Notes section with timestamped, searchable records |
| No sense of overall progress | Transition Readiness Score (0–100) combining task, doc, and job progress |

---

## What to Test with the Real Person

This is a research tool as much as a product. When testing with a real graduating international student, focus on:

1. **Does the Readiness Score feel accurate?** Ask: "Does this score reflect how prepared you actually feel?" If not, which category is wrong?

2. **Does the Focus Assistant surface the right priorities?** Ask: "Are these the three things you'd actually focus on today?" Observe whether they agree or immediately identify a different priority.

3. **Is the task list complete for their situation?** The sample data covers common tasks, but every student has a unique trajectory. What's missing?

4. **Does the Document tracker match their actual document needs?** International students from different countries and in different visa situations may have different critical documents.

5. **Do they use the Notes section?** Does it feel valuable or redundant given how they already take notes?

6. **What causes anxiety that the app doesn't address?** Open-ended question — the app may be solving the wrong problem for this specific user.

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

All data is stored in the browser's localStorage under the prefix `lb_`. To reset to sample data, clear localStorage in DevTools → Application → Local Storage.

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx        # Left navigation
│   ├── Dashboard.jsx      # Overview + readiness score
│   ├── Timeline.jsx       # Task list with filtering
│   ├── Documents.jsx      # Document status tracker
│   ├── JobTracker.jsx     # Job application pipeline
│   ├── Notes.jsx          # Freeform notes
│   ├── AssistantPanel.jsx # Rule-based focus suggestions
│   └── Modal.jsx          # Shared modal overlay
├── data/
│   └── sampleData.js      # Pre-populated sample content
├── hooks/
│   └── useLocalStorage.js # Persistent state hook
└── utils/
    └── helpers.js         # Scoring, formatting, config maps
```

---

*Built for SCAD AI 201 — Persons Required. Spring 2026.*

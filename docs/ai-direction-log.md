# AI Direction Log

> What I asked AI to do, what it produced, what I changed or kept and why.

---

## Entry 1 — Initial app scaffold

**What I asked:**  
Set up a Vite + React + Tailwind CSS project with a sidebar navigation and five pages: Dashboard, Timeline, Documents, Job Tracker, and Notes. Use localStorage for persistence with a custom hook.

**What AI produced:**  
A working scaffold with sidebar navigation, page routing via useState (no React Router), and a `useLocalStorage` hook that serialized/deserialized JSON correctly. The structure was clean and the hook worked on first use.

**What I kept:**  
The entire architecture. The decision to use component-level state passed as props rather than a global store (Context or Redux) was something AI suggested and I agreed with — the app is small enough that prop-drilling is manageable and the overhead of a store wasn't justified.

**What I changed:**  
The sidebar was initially just a list of text links. I asked AI to redesign it with icon support using `lucide-react` and an active-state highlight that matched the page's color category. AI produced a version using emoji initially — I redirected it to use proper icon components.

---

## Entry 2 — Readiness Score algorithm

**What I asked:**  
Build a Transition Readiness Score from 0–100 calculated from task completion, document status, and active job applications. Show it as an SVG ring on the dashboard with color states (amber → indigo → green as score improves).

**What AI produced:**  
The `calculateReadinessScore()` function and `ReadinessRing` SVG component. The initial weighting was equal thirds (33/33/33). The SVG ring geometry was correct on the first attempt — `strokeDasharray` and `strokeDashoffset` calculated from circumference.

**What I kept:**  
The SVG ring implementation entirely. The animation (`transition: stroke-dashoffset 0.8s ease`) was AI's suggestion and it made the score feel meaningful rather than static.

**What I changed:**  
Reweighted the score to 50% tasks / 30% documents / 20% jobs. Equal thirds didn't reflect the real priority hierarchy — tasks are what Nico controls most directly, documents are critical but fixed in number, and jobs are partially outside his control (rejections shouldn't tank his score). I made that argument to AI, gave it the new weights, and it updated the function.

---

## Entry 3 — OPT countdown banner

**What I asked:**  
Add a banner to the dashboard that calculates days until the OPT application deadline (90 days before graduation date) and the 60-day grace period. Pull the graduation date from the user's profile. The banner should change color based on urgency and disappear if the user marks their EAD as received.

**What AI produced:**  
The `optCountdown` computed object inside `Dashboard.jsx` — a series of conditional states (`deadline`, `late`, `grace`, `expired`, `done`) each with appropriate messaging and color logic.

**What I kept:**  
The state machine structure (five distinct states for the OPT lifecycle) was exactly right. AI correctly reasoned that the experience of a user who has 30 days to apply is completely different from one who has 5 days, who is different from one whose deadline already passed.

**What I changed:**  
The initial "urgent" threshold was 7 days. I changed it to 14 days — because OPT paperwork takes time to prepare and getting 7 days of warning is not actually enough time to act. 14 days gives Nico a real window to respond. I also changed the banner text from generic urgency language ("Act now!") to specific process guidance: "apply at least 90 days before graduation" and "Find employment or change status before the grace period ends."

---

## Entry 4 — Focus Assistant Panel (priority engine)

**What I asked:**  
Build a right-panel Focus Assistant that surfaces the top 3 most urgent tasks based on deadline and priority, without using any AI/LLM. Rule-based only. Also show quick stats and a contextual tip based on the current score and overdue count.

**What AI produced:**  
The `getTopPriorities()` function in `helpers.js` and the `AssistantPanel` component. The sort logic: overdue first, then deadline within 3 days, then high priority, then nearest deadline.

**What I kept:**  
The sort order. This was something AI reasoned through carefully and it matched what I would have written — overdue tasks are the most urgent by definition, then imminent deadlines, then flagged priority. The structure was sound.

**What I changed:**  
AI initially proposed an "Assistant" panel that had a text input field — a chat interface where Nico could ask questions. I rejected this entirely (see Records of Resistance). The replacement was this rule-based panel, which AI built correctly once I gave it the right brief.

I also changed the "Tip" messages. AI's initial tips were generic productivity advice ("Try the Pomodoro technique!"). I rewrote them to be specific to the transition context — tied to OPT status, document readiness, and overdue count — and had AI refactor the `getTip()` function around those conditions.

---

## Entry 5 — Sample data

**What I asked:**  
Generate realistic sample data for a graduating international student: 14 tasks across 6 categories (visa, job, housing, finances, networking, personal), 8 documents with mixed statuses, 5 job applications including one in the interview stage, OPT step tracking, a budget, apartment options, network contacts, and notes.

**What AI produced:**  
The `sampleData.js` file with all of the above. The data was internally consistent — the job applications referenced roles that made sense for a design student, the notes referenced events that matched the timeline, the OPT steps aligned with the actual USCIS process.

**What I kept:**  
Almost everything. The OPT step sequence was accurate to real USCIS process. The job applications (Figma, Google, Notion, Duolingo, Meta) fit a graduating UX/design student's realistic target list.

**What I changed:**  
The initial contacts list was generic (fictional names with no company context). I asked AI to ground them in a realistic graduation context — a recruiter met at a career fair, a LinkedIn cold outreach, a professor writing a reference letter. The revised contacts felt like they belonged to a real person. I also added "Professor Tim Lindsey" to the contacts as a deliberate detail.

---

## Entry 6 — Onboarding screen

**What I asked:**  
Build an onboarding screen that appears on first load (checked via localStorage flag). Collect: name, graduation date, and OPT status (a dropdown with realistic status options). Store in the `lb_profile` key.

**What AI produced:**  
The `Onboarding.jsx` component with form validation, a welcome message, and a clean card layout.

**What I kept:**  
The structure and form behavior. The validation logic (requiring name and graduation date before proceeding) was correct.

**What I changed:**  
The initial OPT status options were written in technical USCIS language. I simplified them to plain English — "Haven't started yet," "Application in progress," "EAD received" — because Nico should not need to know what "Form I-765 pending adjudication" means to use the app. The technical meaning lives in the visa tracker; the onboarding screen should speak plainly.

---

## Entry 7 — Mobile responsiveness

**What I asked:**  
Make the dashboard and all pages responsive for tablet and mobile viewports. The sidebar should collapse on small screens. The three-column dashboard header should stack to single column below md breakpoint.

**What AI produced:**  
Tailwind responsive classes throughout (`grid-cols-1 md:grid-cols-3`, `hidden md:flex`, etc.) and a mobile hamburger menu toggle for the sidebar.

**What I kept:**  
All of it. AI handled the responsive layout correctly and the sidebar collapse behavior worked on first attempt.

**What I changed:**  
On mobile, the sidebar originally pushed the content to the right (overlay pattern). I changed it to a full-screen overlay instead — because on a small screen, a sidebar that partially covers content is worse than a menu that takes over temporarily and then disappears completely.

# User Testing Evidence

---

## Session Details

**Tester:** Nico Fertonani  
**Format:** In-person, think-aloud session  
**Device:** Laptop (Chrome browser)  
**App state:** Loaded with sample data pre-populated to reflect a realistic graduating student's situation  

---

## What happened

Nico was given the link and no instructions. The task: "Use it. Tell me what you're thinking."

### First 30 seconds

He went directly to the **Readiness Score**. He read the number, looked at the ring, and said it immediately made sense — he understood what it represented without being told. His first reaction was something like relief: he could see, at a glance, that he was "in progress" but not in crisis.

After the score, he moved to the **"Needs Attention Soon" section** — the urgency panel showing tasks due within five days. He scanned through the deadlines and said this was the most useful part of the dashboard: instead of trying to remember what was coming up, he could see it.

### Where he went next

He navigated to the **Job Tracker** before the Timeline or Documents. He scrolled through the sample job entries and checked the interview status on the Google application. He said he expected the job tracker to feel connected to the visa tracker — because whether an employer is willing to sponsor or work with OPT status directly affects which jobs to prioritize. He noted that connection wasn't fully surfaced in the UI.

He then went to **Documents** and checked the status of each item. He moved quickly through this page — the status tags (Ready, In Progress, Missing) were immediately readable. He didn't need to be oriented.

### What he reached for that wasn't there

He looked for a way to **link a job application to a deadline or a document**. The idea was: if he's applying for a job, he needs his resume updated, which is a document. He wanted those threads to connect visibly — not just exist in separate sections.

He also looked for some kind of **"what should I do today"** output that was more specific than the top priorities panel. Not a chatbot — he didn't ask for conversation — but a generated short list tied to his actual calendar context.

### What he ignored

He didn't open the **Budget Planner** during the session. It wasn't that he found it uninteresting — he noted it later as something he'd use — but in a session where he was processing everything at once, financial planning felt like a "later" task, not a "today" task.

He also scrolled past the **category progress bars** on the dashboard without stopping. They registered, but didn't pull his attention the way the deadline-based panels did.

### What surprised him

The **OPT countdown banner** at the top of the dashboard stopped him. He read it carefully. He said he hadn't thought about the 90-day rule in those terms — as a concrete number of days from the current date — and seeing it expressed that way made it feel real in a way that a checklist item didn't. That was the moment where the app moved from "useful tool" to "tool I would actually use."

---

## Key Takeaways

| Observation | Design Implication |
|---|---|
| Went to readiness score first | Score placement and visual weight are correct |
| Focused immediately on urgent deadlines | Deadline-first organization validated |
| Expected job tracker and visa tracker to be linked | Cross-section connection is a gap |
| Skipped budget planner in session | Financial tools should not be primary — they're secondary support |
| OPT countdown produced the strongest emotional response | That banner earns its prominence |
| Wanted more specific "today" output | Assistant panel could be more contextually specific |

---

## Quotes from the session

> "This helps me see what needs attention right now instead of trying to remember everything."

> "I expected the job tracker and the visa tracker to feel connected, because one decision can affect the next step."

> "I'd actually use this. Especially this part." *(pointing at the OPT countdown banner)*

---

## What this changed in the design

After this session, the OPT countdown logic was refined to be more specific about urgency thresholds — turning red when within 14 days rather than just showing a static countdown. The "Needs Attention Soon" section was also kept prominent on the dashboard rather than moved to a secondary page, because Nico's session confirmed that deadline urgency is the first thing a user in his position wants to see.

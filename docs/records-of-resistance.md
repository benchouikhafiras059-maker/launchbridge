# Records of Resistance

> Documented moments where I rejected or significantly revised AI output.

---

## Moment 1 — Rejected the chatbot interface

**What AI produced:**

When I asked for a "Focus Assistant" panel, AI built a chat interface. It had a text input field at the bottom, a scrolling message history, and an AI-generated response system that would answer questions like "What should I do today?" The panel had a bot avatar, a typing indicator, and suggested prompts like "Show me my urgent tasks" or "What's my OPT deadline?"

**Why I rejected it:**

This was the wrong answer to the right question. Nico doesn't need to ask the app what his priorities are — the app already has all the data. Making him type a question to get information the system already knows creates unnecessary friction between the user and his own data. It also implies a conversational relationship with the tool that doesn't fit the context. When you're stressed about visa deadlines and job applications, you don't want to chat. You want to see.

More importantly: a chatbot interface would have been AI generating advice about AI-managed data. The abstraction layer was wrong. The tool should surface information, not mediate it.

**What I did instead:**

I asked AI to scrap the chat component entirely and build a rule-based priority panel. The brief: "Show the top 3 most urgent tasks using a defined sort order — overdue first, then deadline within 3 days, then high priority. No input field. No generated text. Just the tasks." The result is the Focus Assistant Panel that exists in the app — a deterministic, data-driven display that requires no user prompt to be useful.

---

## Moment 2 — Rejected the color palette

**What AI produced:**

The initial color palette AI chose for the dashboard was blue-dominant with high contrast: deep navy headers, bright blue primary buttons, white backgrounds with blue borders. Clean, corporate, professional. The kind of palette you'd see on a bank portal or a government service site.

**Why I rejected it:**

Nico's context is already high-stress. He is managing immigration deadlines while job searching while finishing school. The tool should reduce ambient anxiety, not amplify it. A corporate color scheme — the same visual language as the USCIS website, the university portal, and LinkedIn — would have made the app feel like another institutional obligation rather than a personal tool.

The blue-heavy palette also didn't differentiate between urgency levels. Everything felt equally formal and important, which is the opposite of what a prioritization tool needs.

**What I did instead:**

I specified a different direction: indigo as the primary (warmer and less corporate than navy blue), slate for neutral surfaces, amber for moderate urgency, red only for true emergencies, and emerald for completed/positive states. Each color carries a meaning — the palette is a communication system, not a branding exercise. I gave AI the specific Tailwind color classes I wanted used for each state and had it refactor the component color logic around that system.

---

## Moment 3 — Rejected the equal-weight readiness score

**What AI produced:**

The first version of `calculateReadinessScore()` weighted all three inputs equally: one third from task completion, one third from document readiness, one third from active job applications. The logic was: "all three categories contribute to transition readiness, so they should count equally."

**Why I rejected it:**

Equal weighting doesn't reflect the actual hierarchy of control and consequence. Tasks are the primary measure — they're what Nico directly controls, they span all categories of his transition, and they're the most comprehensive signal of overall progress. Documents are critical but bounded — there are eight of them, and their status is mostly binary. Jobs are partially outside Nico's control — he cannot force a company to respond, and getting rejected from five applications after applying to ten should not cut his readiness score in half.

Weighting them equally would mean that a bad week of job rejections would visually tank a score that reflects real, meaningful progress everywhere else. That's demotivating in exactly the wrong moment.

**What I did instead:**

I argued for a weighted model: tasks at 50%, documents at 30%, jobs at 20%. I explained the reasoning to AI and had it update the function. The new weights mean the score reflects what Nico can control most, treats documents as important but not dominant, and lets the job search contribute to progress without punishing him for factors outside his control. The score became a tool for motivation rather than a source of anxiety.

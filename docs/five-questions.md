# Five Questions Reflection

> Completed before submission. These hit different when the person you're helping has a name.

---

## 1. Who are you designing for, and what do you actually know about them?

Nico Fertonani. International student from Argentina, finishing his degree at SCAD, navigating OPT paperwork and a job search simultaneously while trying to figure out housing and finances. I know he experiences his transition as a fragmentation problem — not an information problem. He said it plainly: everything is connected, but nothing is in one place, and he doesn't always know what to prioritize first.

What I know about him came from listening, not assuming. I assumed he needed better visa information. What he actually needed was a unified view of everything he already knew, organized so he could act on it. That's a different tool. It took the interview to understand the difference.

---

## 2. What is the core problem you are solving — not the feature, the problem?

Cognitive fragmentation under deadline pressure. Nico is managing five or six distinct systems (visa, jobs, housing, documents, finances, networking) that all affect each other, across five or six separate tools (browser tabs, email, PDFs, mental notes) that don't talk to each other. The result is a persistent background anxiety — the sense that something important might be slipping through without being able to verify it isn't.

The problem is not that he lacks information. It's that he can't hold all the information at once in a form that tells him what to do next. LaunchBridge is a consolidation tool, not an information source.

---

## 3. How did your research change what you built?

Significantly.

Before the interview, I was planning to build something closer to an information resource — a tool that explained OPT timelines, visa rules, and housing options. An educational tool with structured guidance.

After the interview, I understood that Nico doesn't need education. He's done the research. He knows the OPT deadline is 90 days before graduation. He knows he needs a lease but can't sign one until he has an offer letter. What he can't do is keep all of that in his head at once and know what to do today.

The pivot was from "information tool" to "prioritization and consolidation tool." The Focus Assistant Panel, the Readiness Score, the "Needs Attention Soon" section on the dashboard — all of these emerged from that one conversation. The research didn't confirm my plan. It replaced it.

---

## 4. Where did AI help and where did it get in the way?

**Where it helped:** Scaffolding fast. Building the SVG readiness ring, implementing the OPT countdown state machine, structuring the job tracker interview log, generating realistic sample data that was internally consistent. For well-defined technical tasks, AI was a capable and fast collaborator.

**Where it got in the way:** When I didn't give it a strong enough design brief, it defaulted to patterns that looked right but didn't fit Nico. The chatbot assistant panel. The corporate color palette. The equal-weight readiness score. All of these were technically competent answers to the wrong version of the question. AI produced what a generic productivity tool would produce. The job was to build a tool for Nico, and that required me to hold that distinction clearly and push back when AI drifted from it.

The lesson: AI is a capable builder but a poor designer. It knows what productivity apps usually look like. It doesn't know what Nico needs.

---

## 5. What would you do differently if you were starting over?

I would involve Nico earlier in the design process — not just interview him before building and test with him after, but bring him into decisions during the build. There are features in the app that I thought would be useful (the Budget Planner, the Housing Finder) that Nico didn't engage with in testing. If I had shown him early wireframes, I might have caught that sooner and invested more time in the features that actually mattered to him.

I would also be more deliberate about what I let AI scaffold versus what I designed myself first. For the core pages — Dashboard and the Focus Assistant — I had a clear design intent before I asked AI to build them, and the results were better for it. For some of the secondary pages, I let AI lead the design, and the results felt more generic. The quality of what AI builds is bounded by the clarity of what I bring to the brief.

Finally, I would build in a way to see cross-section connections — Nico asked for the job tracker and visa tracker to feel linked. That's a more interesting design problem than I had time to solve, and it points to a real opportunity.

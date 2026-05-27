# Post-Mortem

> Written reflection on the full Design Cycle. What worked, what failed, what I'd do differently, what I learned about designing for a real person.

---

## What worked

**Starting with Nico, not with the idea.**

The interview reoriented the entire project. I went in thinking I was building an information tool. I came out understanding I was building a consolidation and prioritization tool. That shift — which came entirely from listening — made the final product more useful than anything I had planned to build before meeting him. The readiness score, the urgency panel, the OPT countdown: all of these came from understanding his actual problem, not the problem I assumed he had.

**Holding a design argument before touching the code.**

Writing the design argument first — before any AI engagement — gave me a fixed point to return to whenever a decision felt unclear. When AI produced a chatbot interface, I knew it was wrong because I had already written down that Nico doesn't need advice, he needs a mirror. The design argument functioned as a brief, and working from a brief is better than working from instinct.

**The OPT countdown banner.**

This turned out to be the most emotionally resonant part of the app. When Nico saw his OPT deadline expressed as a concrete number of days tied to his actual graduation date, it stopped him. It made the deadline real in a way that a checklist item doesn't. That was a good design decision: put the most time-sensitive, highest-consequence information at the top of the page where it cannot be missed.

**Resisting the chatbot default.**

The easiest thing to build would have been a chat interface — AI tools are what AI naturally produces when you ask for an "assistant." Rejecting that and replacing it with a rule-based priority system was the right call. It took more design work (defining the sort order, deciding what "priority" means in this context) but produced a better tool. The outcome is more useful precisely because it requires no user prompt.

---

## What failed

**The cross-section connection problem.**

Nico's clearest piece of feedback during testing was that he expected the job tracker and the visa tracker to feel connected — because a job's OPT-sponsorship status directly affects whether he should pursue it. That connection doesn't exist in the current UI. The two sections are siloed. This is a real design failure: the core thesis of the app is that everything is connected, and then the interface doesn't reflect those connections.

**Secondary features that weren't tested before building.**

The Budget Planner and Housing Finder were built before I knew whether Nico would use them in the way I imagined. Testing revealed that he viewed financial planning as a "later" task, not a "today" task — meaning those features are correctly built but incorrectly weighted. I spent time building tools that the user didn't reach for first. Earlier feedback could have redirected that effort.

**The generic feel of some secondary pages.**

The pages I briefed AI on most carefully — Dashboard, Focus Assistant, OPT Tracker — feel specific to Nico's situation. The pages where I gave AI more latitude to make design decisions feel like a general productivity app. The difference is visible if you look at the two side by side. Brief quality translates directly to output quality.

---

## What I would do differently

**Bring Nico into the build, not just the bookends.**

I interviewed Nico before building and tested with him after. I should have shown him low-fidelity sketches midway through — even rough outlines of the page structure — and asked what was missing or wrong before committing to implementation. Designing with someone is different from designing for someone.

**Define the information hierarchy before designing the pages.**

I started building pages before I had fully resolved what information belonged where. The result is that some things appear in multiple places (readiness score is on both the dashboard and the sidebar panel) and some things are missing connections that should be there. A proper information architecture would have caught those issues earlier.

**Write the Records of Resistance in real time.**

I documented my resistance moments after the fact, from memory. I should have kept a running log as the project developed — noting in the moment when I rejected something and why. Real-time documentation would have been more accurate and more useful as a reflection tool.

---

## What I learned about designing for a real person

The difference between designing for Nico and designing for "an international student" is the difference between solving a problem and solving a category of problem. When I had a specific person — with a name, a country, a graduation date, a quote I could read back to myself — every design decision had a test: *would this help Nico?*

That question is harder to answer for a hypothetical user. A hypothetical user can't tell you that they expected the job tracker and visa tracker to feel connected. A hypothetical user can't stop at an OPT countdown banner and tell you it made the deadline feel real. Nico could.

Designing for a real person means accepting that your assumptions will be wrong. The research doesn't confirm the plan — it corrects it. That correction is not a problem in the process. It is the process.

The tool I built is better than the tool I planned to build, because Nico exists and I talked to him.

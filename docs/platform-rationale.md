# Platform Rationale

---

## The decision: A React web application

LaunchBridge is a browser-based React app, hosted on GitHub Pages, built with Vite, Tailwind CSS, and localStorage for persistence. This was not a default choice — it was a decision made from what I learned about Nico.

---

## Why not a mobile app?

Nico is not managing his post-graduation transition on his phone. He is at his desk, with a laptop open, running multiple tabs. The decisions he is making — filling out OPT paperwork, writing cover letters, comparing apartments, tracking interview rounds — are seated, deliberate, multi-step tasks. A mobile app would have been optimized for a behavior pattern that doesn't match how he actually works.

More importantly: a mobile app requires installation, an app store, a development and distribution pipeline, and a platform choice (iOS vs. Android) that would have introduced friction that serves the builder's preferences, not the user's needs. Nico doesn't need to download something. He needs to open a link.

---

## Why not a native desktop application?

Same reasoning. Desktop-native apps require installation and platform-specific builds. A browser tab achieves everything a desktop app would achieve for this use case, with zero installation friction. Nico can open it on any machine, share the link, and access it immediately.

---

## Why not a Chrome extension?

An extension would imply that the core use case is *browsing* — augmenting other tabs in real time. That's not what this is. LaunchBridge is not a companion to other tools; it is a replacement for the scattered system of other tools. It deserves its own space, not a sidebar position next to whatever else is open.

---

## Why not a physical kiosk or printed artifact?

Nico's problem is dynamic. His tasks change. His deadlines shift. His document status updates. A static artifact — a printed checklist, a poster, a kiosk — cannot respond to that dynamism. The tool needs to live where the data can change.

---

## Why React specifically?

The dashboard needed multiple interconnected views: task state, document status, job applications, a readiness score computed across all of them. That kind of reactive, state-driven UI is exactly what React was built for. When Nico marks a task complete, the readiness score updates immediately. When he changes a document's status, the dashboard reflects it. That real-time coherence across views required a component-based state model.

Plain HTML and JavaScript would have worked for a simpler tool, but the cross-panel data relationships — the readiness score pulling from tasks, documents, and jobs simultaneously — made a state management framework the right tool.

---

## Why localStorage instead of a backend?

Because Nico doesn't need to share his data with anyone. His transition plan is personal. Adding a backend would mean accounts, authentication, passwords, a database, hosting costs, and a surface area for things to go wrong — none of which are justified by the use case.

localStorage is local, private, fast, and persistent across sessions without any of that overhead. The tradeoff is no cross-device sync, which is acceptable because the use case is single-person, single-device.

---

## The short version

Nico uses a laptop. He needs a browser tab that consolidates what is currently twenty browser tabs. React gives the app the reactive cross-panel behavior the design requires. localStorage keeps the data where it belongs: with him, private, and persistent. Everything else was ruled out because it served the builder's preferences, not the user's actual behavior.

# Architecture rules
- Keep the prototype experience in src/prototype with scoped styles so existing account, payment, journal and admin workflows remain intact.
- Run prototype text pattern matching locally and distinguish matched claims from verified facts; image analysis uses the existing analyse-trust function.
- Keep prototype deal, signal and timer state local with explicit opt-in persistence; never represent a local timer as an automatic contact-alert service.
- Never activate pilot pricing, identity badges or verification invitations without approved pricing and an actual provider.
- No app-shell service worker: public/sw.js is a kill-switch that evicts the old Workbox worker which served stale copies of the site; home-screen support is manifest-only.

# geleus.io

**geleus.io now redirects to the résumé section of the main site: https://geleus.com/#resume**
(`index.html` is a meta-refresh + `location.replace` redirect with a canonical link). The interactive
terminal résumé itself lives in the `pidoshva.github.io` repo (`js/resume.js`, loaded lazily by
`js/spatial.js` into section 5 of the spatial homepage, with jquery.terminal vendored in `lib/`).

- Hosted on GitHub Pages from `main` (root), custom domain via `CNAME` → `geleus.io`.
- `countdown/` is a separate, unrelated PWA (trip countdown + Scriptable widget) served at
  geleus.io/countdown/ — leave it alone.
- `index.xml`, `sitemap.xml`, `categories/`, `tags/` are leftover Hugo feeds from the old build; harmless.

To edit the résumé content or commands: see `pidoshva.github.io/js/resume.js` and that repo's
ARCHITECTURE.md §3 (section 5 — resume).

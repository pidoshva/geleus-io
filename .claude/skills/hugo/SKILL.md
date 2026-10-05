---
name: hugo
description: |
  Manages Hugo-generated static output files (HTML, XML feeds, sitemap) for the geleus.io resume site.
  Use when: editing Hugo-generated HTML structure, modifying XML feeds, updating sitemap entries,
  fixing Hugo template artifacts in index.html, or understanding the relationship between
  Hugo output and the source templates that produced it.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Hugo Skill

This repository contains **Hugo's compiled output only** — not the source templates. Hugo 0.101.0 generated `index.html`, RSS feeds, a sitemap, and empty taxonomy feeds. All hand-edited content (resume data, terminal logic) lives inside the Hugo-generated `index.html` shell. See the **javascript** skill for command logic and the **jquery-terminal** skill for terminal API details.

## Output Inventory

| File | Hugo Role | Editable |
|------|-----------|----------|
| `index.html` | Main page from `baseof.html` + `index.html` templates | Yes — JS/CSS content inside the template shell |
| `index.xml` | Root RSS feed | Rarely — empty channel, no items |
| `sitemap.xml` | URL list for crawlers | Only to add/remove URLs |
| `categories/index.xml` | Taxonomy RSS feed | No — empty, leave as-is |
| `tags/index.xml` | Taxonomy RSS feed | No — empty, leave as-is |
| `CNAME` | GitHub Pages domain config | Only to change domain |

## Hugo Fingerprints in index.html

```html
<!-- Line 2: malformed double <html> — Hugo template artifact, do NOT fix -->
<html xmlns="http://www.w2.org/1999/xhtml">
<html lang="en">

<!-- Line 5: generator meta tag identifies Hugo version -->
<meta name="generator" content="Hugo 0.101.0" />

<!-- Lines 60-75: Hugo template whitespace around conditional blocks -->
    certifications: "list certifications",
        <!-- blank lines from {{ if }} blocks in the source template -->
        startx: "starts graphical environment",
```

## Key Concepts

| Concept | Detail |
|---------|--------|
| Output-only repo | No `config.toml`, no `content/`, no `layouts/` — only built artifacts |
| Template artifacts | Extra whitespace, double `<html>` tags, empty `href=""` on sitemap link |
| Taxonomy feeds | `categories/index.xml` and `tags/index.xml` are empty — Hugo default taxonomy output |
| Sitemap entries | Lists `/`, `/categories/`, `/tags/` — no `<lastmod>` dates |
| RSS channel | `index.xml` has channel metadata but zero `<item>` elements |

## Common Patterns

### Safe Edit Zones in index.html

The `<script>` block (lines 45–546) and `<style>` block (lines 32–37) are safe to edit — they contain hand-written code injected via Hugo templates. Everything outside these blocks is Hugo boilerplate.

```html
<!-- SAFE to edit: inline styles -->
<style>
    body { width: 100%; font-size: 18px; }
</style>

<!-- SAFE to edit: all JavaScript inside <script> -->
<script>
jQuery(document).ready(function($) {
    // ...all resume data and terminal logic...
});
</script>

<!-- DO NOT edit: Hugo <head> boilerplate (meta tags, link tags) -->
<meta name="generator" content="Hugo 0.101.0" />
<link rel="canonical" href="https://geleus.io/" />
```

### Updating the Sitemap

```xml
<!-- sitemap.xml — add new URLs by inserting <url> blocks -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://geleus.io/</loc>
  </url>
  <!-- Add new pages here if the site expands -->
</urlset>
```

## Workflow: Modifying Hugo Output

Copy this checklist and track progress:
- [ ] Identify whether the change targets Hugo boilerplate or inline content
- [ ] If Hugo boilerplate: consider whether the source templates should change instead
- [ ] If inline content (`<script>`, `<style>`): edit directly in `index.html`
- [ ] Validate: open `index.html` in browser, check for rendering issues
- [ ] Validate: check browser console for JS errors
- [ ] If XML files changed: validate with `xmllint --noout <file>` or browser

## Validation Loop

1. Make changes to `index.html` or XML files
2. Open in browser and test affected sections
3. If editing XML: ensure well-formed XML (no broken tags)
4. If errors, fix and repeat step 2

## WARNING: No Hugo Build Available

This repo has no Hugo source directory. Running `hugo` or `hugo server` will fail. To regenerate output from templates, locate the original Hugo source project. All changes must be made directly to the compiled output files.

## See Also

- [patterns](references/patterns.md) — Hugo output patterns and edit safety
- [types](references/types.md) — file types and their XML/HTML structure
- [modules](references/modules.md) — Hugo output organization and taxonomy system

## Related Skills

- See the **javascript** skill for editing command logic and resume data inside `index.html`
- See the **jquery-terminal** skill for terminal formatting syntax and plugin configuration
- See the **jquery** skill for DOM initialization patterns
- See the **frontend-design** skill for CDN dependencies and styling

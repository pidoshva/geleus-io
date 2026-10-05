# Hugo Output Organization

## Contents
- Directory Structure
- Hugo's Default Output Types
- Taxonomy System
- Relationship to Source Templates

## Directory Structure

```
geleus-io/
├── index.html            # Hugo list template output (homepage)
├── index.xml             # Hugo RSS output (root feed)
├── sitemap.xml           # Hugo sitemap output
├── CNAME                 # GitHub Pages config (NOT Hugo-generated)
├── categories/
│   └── index.xml         # Hugo taxonomy RSS (empty)
└── tags/
    └── index.xml         # Hugo taxonomy RSS (empty)
```

Every file except `CNAME` was produced by Hugo's output pipeline. The flat structure reflects a single-page site with no content sections or blog posts.

## Hugo's Default Output Types

Hugo generates multiple output formats per page. For this site's homepage:

| Output | File | Hugo Config Key |
|--------|------|-----------------|
| HTML | `index.html` | `outputs.home = ["HTML", "RSS"]` |
| RSS | `index.xml` | Default for home page |
| Sitemap | `sitemap.xml` | Always generated unless disabled |

The source `config.toml` (not in this repo) controlled which outputs were enabled. The presence of RSS feeds with zero items indicates the site was configured as a standard Hugo site, not a specialized single-page config.

## Taxonomy System

Hugo created `categories/` and `tags/` directories automatically because taxonomies are enabled by default in Hugo 0.101.x. These directories contain only `index.xml` feeds — no `index.html` pages — because the site likely had `disableKinds` partially configured or used a theme that skipped taxonomy HTML.

```
categories/index.xml  → <title>Categories on Vadim Pidoshva</title>
tags/index.xml        → <title>Tags on Vadim Pidoshva</title>
```

Both feeds are valid RSS 2.0 with empty channels. To suppress them entirely, the Hugo source would need:

```toml
# In config.toml (source repo, not here)
disableKinds = ["taxonomy", "term"]
```

Since we only have the output, leave these files in place.

## Relationship to Source Templates

The Hugo source project (not in this repo) had a structure like:

```
hugo-source/             # NOT this repo
├── config.toml          # baseURL = "https://geleus.io/"
├── content/
│   └── _index.md        # Homepage content (if any)
├── layouts/
│   ├── _default/
│   │   └── baseof.html  # Produced the <html>/<head>/<body> shell
│   └── index.html       # Injected <script> and <style> blocks
├── static/
│   └── CNAME            # Copied to output root
└── themes/              # Theme providing base templates
```

Key mapping from source to output:

| Source Template | Produces | In This Repo |
|-----------------|----------|--------------|
| `layouts/index.html` or theme `index.html` | Main page content | `index.html` lines 45-546 (the `<script>` block) |
| `layouts/_default/baseof.html` | HTML shell, `<head>`, CDN links | `index.html` lines 1-44 and 547-549 |
| Hugo internal RSS template | RSS feeds | `index.xml`, `categories/index.xml`, `tags/index.xml` |
| Hugo internal sitemap template | Sitemap | `sitemap.xml` |
| `static/CNAME` | Domain config | `CNAME` |

When editing this output repo, always consider whether the change belongs in the Hugo source instead. Direct output edits are appropriate for content updates (resume data in JS) but not for structural HTML changes (meta tags, document skeleton). See the **javascript** skill for editing the inline content safely.

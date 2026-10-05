# Hugo Output Patterns

## Contents
- Template Artifacts to Preserve
- Safe vs Unsafe Edit Zones
- Hugo Conditional Whitespace
- Anti-Patterns

## Template Artifacts to Preserve

Hugo 0.101.0 left several artifacts in `index.html` that look like bugs but are intentional template output. Do NOT "fix" these.

### Double `<html>` Tags (Line 2-3)

```html
<!-- This is a Hugo template artifact — the xmlns and lang attributes
     came from separate template blocks. Browsers handle it fine. -->
<html xmlns="http://www.w2.org/1999/xhtml">
<html lang="en">
```

Removing either tag may break the document structure that Hugo's template expects. Leave both.

### Empty `href` on Sitemap Link (Line 15)

```html
<!-- Hugo template produced an empty href — harmless, leave it -->
<link rel="sitemap" type="application/xml" title="Sitemap" href=""/>
```

### Generator Meta Tag (Line 5)

```html
<!-- Identifies the Hugo version — keep for diagnostics -->
<meta name="generator" content="Hugo 0.101.0" />
```

## Safe vs Unsafe Edit Zones

```
index.html structure:
├─ <!DOCTYPE html>              ← DO NOT EDIT
├─ <html> (x2)                  ← DO NOT EDIT (Hugo artifact)
├─ <head>
│  ├─ <meta> tags               ← DO NOT EDIT (Hugo boilerplate)
│  ├─ <script> CDN imports      ← Edit only to update CDN versions
│  ├─ <link> CSS imports        ← Edit only to update CDN versions
│  └─ <style>                   ← SAFE TO EDIT
├─ <body>
│  └─ <script>                  ← SAFE TO EDIT (all JS lives here)
└─ </body></html>               ← DO NOT EDIT
```

## Hugo Conditional Whitespace

Hugo's `{{ if }}` blocks produce blank lines in the output when conditionals are present. This is visible in the `commands` object where extra whitespace appears around conditional entries:

```javascript
// These blank lines come from Hugo {{ if .Params.certifications }} blocks
    certifications: "list certifications",
// ← blank line from {{ end }}

// ← blank line from {{ if .Params.startx }}
    startx: "starts graphical environment",
```

NEVER remove this whitespace without understanding it came from Hugo templates. If the source templates are ever rebuilt, cleaned whitespace will reappear.

## Anti-Patterns

### WARNING: Editing Hugo Boilerplate Directly

**The Problem:**

```html
<!-- BAD — modifying Hugo-generated meta tags directly in output -->
<meta property="og:title" content="New Title" />
<link rel="canonical" href="https://new-url.io/" />
```

**Why This Breaks:**
1. If the Hugo source is ever rebuilt, these changes vanish
2. Meta tags should stay consistent with Hugo's `config.toml` settings
3. Creates a maintenance burden tracking which output lines were hand-edited

**The Fix:**
Edit Hugo source `config.toml` and rebuild. If source is unavailable, document any boilerplate edits in a commit message so they can be replicated later.

### WARNING: Removing Empty Taxonomy Feeds

**The Problem:**

```bash
# BAD — deleting "useless" empty feeds
rm categories/index.xml tags/index.xml
```

**Why This Breaks:**
1. `sitemap.xml` references `/categories/` and `/tags/` — broken links result
2. RSS readers or crawlers that discover these feeds will get 404s
3. Hugo regeneration would recreate them anyway

**The Fix:**
Leave empty taxonomy feeds in place. They cost nothing and prevent broken references.

### WARNING: Fixing the Double `<html>` Tag

**The Problem:**

```html
<!-- BAD — "fixing" by removing one -->
<html lang="en">
```

**Why This Breaks:**
1. Browsers already parse the double tag correctly
2. Future Hugo rebuilds will reintroduce the duplicate
3. The `xmlns` attribute may be needed by XML-aware tools processing the output

**The Fix:**
Leave both `<html>` tags. Document the artifact in project notes if it bothers you.

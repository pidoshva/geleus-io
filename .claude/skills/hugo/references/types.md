# Hugo Output File Types

## Contents
- HTML Output
- RSS Feeds
- Sitemap
- CNAME (Non-Hugo)

## HTML Output

### index.html

Single-page output combining Hugo's base template with inline JavaScript and CSS. Hugo generated the outer HTML shell; all interactive content was injected via template blocks.

```html
<!-- Hugo-generated shell structure -->
<!DOCTYPE html>
<html xmlns="http://www.w2.org/1999/xhtml">
<html lang="en">
<head>
    <meta name="generator" content="Hugo 0.101.0" />
    <!-- Hugo: meta tags, OG properties, favicons, canonical URL -->
    <!-- Injected: CDN script/link tags for jQuery + jquery.terminal -->
    <!-- Injected: inline <style> block -->
</head>
<body>
    <!-- Injected: inline <script> block with all terminal logic -->
</body>
</html>
```

Key characteristics:
- No `<div>`, `<main>`, or semantic HTML — `<body>` is the terminal container
- All CDN URLs are hardcoded (no Hugo asset pipeline or fingerprinting)
- Duplicate `<meta charset="utf-8">` on lines 6 and 8 (Hugo template artifact)

## RSS Feeds

### index.xml (Root Feed)

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vadim Pidoshva</title>
    <link>https://geleus.io/</link>
    <description>Recent content on Vadim Pidoshva</description>
    <generator>Hugo -- gohugo.io</generator>
    <atom:link href="https://geleus.io/index.xml" rel="self"
               type="application/rss+xml" />
    <!-- No <item> elements — site has no blog posts or content pages -->
  </channel>
</rss>
```

### categories/index.xml and tags/index.xml

Identical structure to root feed but scoped to taxonomy terms. Both are empty channels with no items. Hugo generates these by default for every taxonomy.

## Sitemap

### sitemap.xml

```xml
<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>https://geleus.io/categories/</loc></url>
  <url><loc>https://geleus.io/tags/</loc></url>
  <url><loc>https://geleus.io/</loc></url>
</urlset>
```

Notable:
- No `<lastmod>` dates — Hugo only includes these when `date` is set in front matter
- Lists taxonomy pages (`/categories/`, `/tags/`) even though they have no content
- The root URL `/` is listed last (Hugo's default ordering)

## CNAME (Non-Hugo)

The `CNAME` file is **not Hugo-generated** — it's a GitHub Pages configuration file containing the custom domain (`geleus.io`). Hugo does not produce this file; it was added manually for deployment.

```
geleus.io
```

If the domain changes, update this file. No other files reference this value directly (the canonical URL in `index.html` is set separately by Hugo's `baseURL` config).

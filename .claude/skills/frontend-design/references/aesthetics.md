# Aesthetics Reference

## Contents
- Color System
- Contrast and Readability
- ASCII Art Guidelines
- Anti-Patterns

## Color System

The site uses CSS named colors passed through jquery.terminal's `[[attributes;foreground;background]text]` markup. There is no design token system — colors are inline string literals.

### Semantic Color Assignments

The codebase follows an implicit color hierarchy:

```
Headers/titles:  red, purple, blue, orange (bold)  — high emphasis
Field labels:    grey (bold)                        — medium emphasis
Body text:       default terminal white             — standard readability
Status/accent:   green (OK), red (FAIL), teal       — semantic meaning
```

Each resume section uses a distinct title color to create visual differentiation when scrolling through `all` output. This is intentional — do not unify all titles to one color.

### Color in the Prompt (`index.html:527`)

The prompt layers five colors to mimic a Bash PS1:

| Segment | Color | Purpose |
|---------|-------|---------|
| `[` `]` brackets | red | Shell-style delimiters |
| `guest@geleus.io` | green | Username@host convention |
| `-` | grey | Separator |
| `~/resume` | gold | Current directory |
| `: ` | orange | Input indicator |

WARNING: Changing prompt colors alters the site's strongest brand element. The red/green/gold/orange combination is recognizable. Adjust individual segments, but preserve the multi-color structure.

## Contrast and Readability

jquery.terminal renders on a near-black background (`#000` default). All foreground colors must be legible against this.

**Safe colors on dark background:** red, green, blue, cyan, magenta, orange, gold, white, grey, purple, teal, yellow

**AVOID on dark background:** dark shades (darkred, darkblue, navy, maroon) — insufficient contrast, nearly invisible in terminal.

### DO / DON'T

```javascript
// GOOD — bright, legible colors
'[[b;cyan;]Problem-Solving:]\n'
'[[b;orange;]Facial Recognition]\n'

// BAD — dark colors vanish on terminal background
'[[b;darkred;]Section Title]\n'
'[[b;navy;]Hard to read]\n'
```

**Why dark colors break:** jquery.terminal's default background is `#000000`. Named dark colors (darkgreen = `#006400`, navy = `#000080`) have contrast ratios below 3:1, failing WCAG readability thresholds.

## ASCII Art Guidelines

The site uses two ASCII art techniques:

### 1. Block Characters for the Greeting Banner (`index.html:528`)

```
█░█ ▄▀█ █▀▄ █ █▀▄▀█   █▀█ █ █▀▄ █▀█ █▀ █░█ █░█ ▄▀█  BETA
▀▄▀ █▀█ █▄▀ █ █░▀░█   █▀▀ █ █▄▀ █▄█ ▄█ █▀█ ▀▄▀ █▀█
```

Uses Unicode block elements (U+2580-259F). The banner is wrapped in `[[b;white;]...]` for maximum contrast. NEVER change the banner color to anything other than white — block characters need full brightness to render cleanly.

### 2. Braille Dot Characters for Source Art (`index.html:351-371`)

The chihuahua ASCII art uses Unicode Braille Patterns (U+2800-28FF). These characters render at roughly half the visual weight of block characters, creating a softer, more detailed image.

When adding new ASCII art:
- Use braille dots (U+2800 block) for detailed images — they provide 2x4 dot resolution per character cell
- Use block elements (U+2580 block) for large text banners — they fill character cells completely
- NEVER mix block and braille in the same art piece — the visual weight mismatch looks broken
- Test in an actual browser, not just a code editor — monospace font metrics vary

## Anti-Patterns

### WARNING: Background Color in Markup

**The Problem:**

```javascript
// BAD — setting a background color
'[[b;white;red]White text on red background]'
```

**Why This Breaks:**
1. Colored backgrounds clash with the terminal aesthetic — terminals use uniform dark backgrounds
2. Background colors don't extend to full line width, creating ugly patchy strips
3. Breaks visual consistency with every other section in the site

**The Fix:**

```javascript
// GOOD — foreground color only, leave background empty
'[[b;white;]White text on default background]'
```

### WARNING: Inline CSS Overrides

**The Problem:** Adding `<style>` rules that override jquery.terminal internals (`.terminal`, `.cmd`, `.terminal-output`).

**Why This Breaks:** jquery.terminal manages its own CSS for cursor positioning, text selection, and scrolling. Overriding `font-family`, `line-height`, or `padding` on terminal elements causes cursor misalignment and broken text selection.

**The Fix:** Only modify the `body` styles already in `index.html:32-37`. For terminal-specific adjustments, use jquery.terminal's API options, not CSS overrides.

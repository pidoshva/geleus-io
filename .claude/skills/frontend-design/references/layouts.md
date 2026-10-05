# Layouts Reference

## Contents
- Terminal Layout
- Content Spacing
- Two-Column Alignment
- Responsive Behavior

## Terminal Layout

jquery.terminal renders full-screen by default when initialized on `<body>`. The only layout CSS in the project is at `index.html:32-37`:

```css
body {
    width: 100%;
    font-size: 18px;
}
```

`width: 100%` ensures the terminal spans the viewport. `font-size: 18px` sets the base size for all terminal text — jquery.terminal inherits this. The terminal library handles its own padding, margins, scrolling, and cursor positioning.

### WARNING: Do Not Add Layout CSS

**The Problem:**

```css
/* BAD — fighting the terminal library */
body {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
```

**Why This Breaks:**
1. jquery.terminal calculates character columns from the terminal width. Constraining width with `max-width` creates a mismatch between the terminal's column count and the visible area
2. Adding `padding` to `body` shifts the terminal's coordinate system, breaking cursor positioning
3. The full-screen dark background IS the design — centering the terminal creates visible page margins that destroy the immersion

**The Fix:** Leave layout to jquery.terminal. Adjust only `font-size` on `body` if text needs to be larger/smaller.

## Content Spacing

All spacing within terminal output is managed through string formatting, not CSS.

### Vertical Spacing Patterns

| Pattern | Renders As | Used For |
|---------|-----------|----------|
| `\n` | Single line break | Between fields in a section |
| `\n\n` | Blank line | Before bullet points, between paragraphs |
| `---\n` | Dash separator + line break | Between entries in the same section |
| `\r` | Array element terminator | End of each data array item |

The `---\n` prefix on section entries acts as a lightweight horizontal rule. It renders as literal text `---`, not a styled element.

### Content Hierarchy

```
[greeting banner]              — block art, white bold
[prompt]: command               — colored prompt, user input
---                            — entry separator
Section Title                  — bold colored (red/blue/purple)
  Metadata (date, location)    — default color, plain

  - Detail bullets             — dash prefix, wrapping
```

Each section follows this visual hierarchy. Titles carry the color, metadata is plain, bullets use dash prefix. NEVER colorize body text or bullet points — the color is reserved for titles and labels to maintain scanability.

## Two-Column Alignment

Two techniques are used for aligned key-value display:

### 1. Tab Characters (manual)

```javascript
'[[b;grey;]Name:]\t\t\tVadim Pidoshva\n'
'[[b;grey;]Email:]\t\t\tpidoshva.vadim@gmail.com\n'
```

Multiple `\t` characters are hand-tuned per label length. Fragile — adding a longer label requires re-counting tabs across all entries.

### 2. `padKey()` Function (programmatic)

```javascript
function padKey(key, length) {
    return key + ' '.repeat(length - key.length);
}
```

Used in `commandsHelp()` and `social()`. Calculates the longest key, then right-pads all keys to match. Combine with a single `\t` after the padded key for the value column.

Prefer `padKey()` over manual tabs for any new two-column output — it adapts automatically when entries are added or removed.

## Responsive Behavior

jquery.terminal handles viewport resizing automatically — it recalculates column count and reflows text. However, the content itself has no responsive breakpoints.

### Known Mobile Issues

1. **Block art banner wraps:** The greeting banner is ~78 characters wide. On phones (~40 columns), it wraps mid-character, producing garbled output
2. **Progress bars are safe:** At 10 characters + percentage text, they fit any reasonable viewport
3. **Bullet text wraps:** Long bullet points in `work` and `projects` include manual `\n` line breaks at ~90 characters. On narrow screens, these create double-wraps

### Validation Workflow

1. Open `index.html` in a browser
2. Test at desktop width (1200px+) — verify banner art renders cleanly
3. Resize to tablet width (~768px) — check that `---` separators and progress bars still align
4. Resize to phone width (~375px) — expect banner art to break; all other content should remain readable
5. If banner breaks, consider a shorter mobile-only greeting (not currently implemented)

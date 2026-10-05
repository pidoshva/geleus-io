---
name: frontend-design
description: |
  Styles the terminal interface with CSS formatting, color markup, Unicode progress bars, and ASCII art for the geleus.io resume site.
  Use when: changing terminal colors, modifying the prompt appearance, updating progress bar styling, editing ASCII art, adjusting font size or body CSS, changing the greeting banner, or altering the visual hierarchy of resume sections.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, mcp__claude_ai_Excalidraw__read_me, mcp__claude_ai_Excalidraw__create_view, mcp__claude_ai_Excalidraw__export_to_excalidraw
---

# Frontend Design

geleus.io is a full-screen terminal emulator styled entirely through jquery.terminal's built-in CSS, inline markup syntax, and a minimal `<style>` block. There are no CSS frameworks, no design tokens, no preprocessors. The visual identity comes from the terminal metaphor itself: monospace text, colored markup, Unicode block characters, and braille-dot ASCII art — all defined in `index.html`.

## Design System Overview

### Color Palette (from markup usage in `index.html`)

| Color | Usage | Markup |
|-------|-------|--------|
| `red` | Job titles, prompt brackets, skill labels | `[[b;red;]text]` |
| `green` | Prompt username, OK status | `[[;green;]text]` |
| `gold` | Prompt path (`~/resume`) | `[[;gold;]text]` |
| `orange` | Prompt colon, project titles, about text | `[[;orange;]text]` |
| `grey` | Field labels (Name, Email, etc.) | `[[b;grey;]text]` |
| `white` | Section headers, greeting banner | `[[b;white;]text]` |
| `purple` | Education titles, skill labels | `[[b;purple;]text]` |
| `blue` | Project titles, skill labels | `[[b;blue;]text]` |
| `cyan` | Soft skill labels | `[[b;cyan;]text]` |
| `teal` | About section header | `[[b;teal;]text]` |

### Typography

The only custom CSS is in `index.html` lines 32-37:

```css
body {
    width: 100%;
    font-size: 18px;
}
```

Everything else is jquery.terminal defaults: monospace font, terminal-standard line height, dark background. NEVER add a custom font — the monospace terminal aesthetic is the entire visual identity of this site.

### The Prompt

The prompt at `index.html:527` uses nested color markup to create a Linux-style shell prompt:

```
[[;red;][][[;green;]guest@geleus.io][[;red;]\]][[;grey;]-][[;red;][][[;gold;]~/resume][[;red;]\]][[;orange;]: ]
```

Renders as: `[guest@geleus.io]-[~/resume]: `

## Visual Components

| Component | Technique | Location |
|-----------|-----------|----------|
| Progress bars | Unicode blocks `&#9611;` (filled) + `&#9617;` (empty) | `progressBar()` at line 79 |
| Greeting banner | Block-character ASCII art | `greetings` option at line 528 |
| Section dividers | `---\n` string prefix | Each data array entry |
| Loading animation | `[===> ] XX%` with `setTimeout` loop | `progress()` / `loading()` at lines 406-437 |
| ASCII art | Braille dot characters (U+2800 block) | `source` variable at line 351 |
| Two-column layout | `padKey()` + tab characters | `commandsHelp()` at line 92 |

## Workflow: Styling a New Resume Section

Copy this checklist and track progress:
- [ ] Step 1: Choose a section color from the existing palette above
- [ ] Step 2: Define data array in `index.html` using `[[b;color;]text]` markup
- [ ] Step 3: Use `---\n` prefix for visual separation between entries
- [ ] Step 4: End each array element with `'\r'`
- [ ] Step 5: For skill-type sections, use `progressBar(n)` for visual bars
- [ ] Step 6: Open `index.html` in a browser to verify appearance
- [ ] Step 7: If colors clash or are hard to read, adjust — test on dark background

## WARNING: Color Name Casing

jquery.terminal color names are case-insensitive in rendering, but the codebase is inconsistent — `languages` array uses `White`, `Blue`, `Yellow` (capitalized) while all other sections use lowercase. ALWAYS use lowercase color names for consistency. The capitalized variants work but create confusing grep results when searching for color usage.

## See Also

- [aesthetics](references/aesthetics.md) — color rules, contrast, ASCII art guidelines
- [components](references/components.md) — progress bars, banners, section formatting
- [layouts](references/layouts.md) — terminal layout, content spacing, responsive behavior

## Related Skills

- See the **jquery-terminal** skill for markup syntax and command dispatch
- See the **javascript** skill for data structure conventions and function patterns
- See the **jquery** skill for DOM initialization and event handling

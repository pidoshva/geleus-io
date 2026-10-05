---
name: jquery-terminal
description: |
  Provides jquery.terminal UI rendering, command dispatch, formatting markup, and autocomplete configuration for browser-based terminal interfaces.
  Use when: modifying terminal commands, adding new commands, changing prompt styling, updating resume data rendering, fixing terminal output formatting, or configuring autocomplete/less pagination.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# jquery-terminal

This project uses jquery.terminal 2.42.x (CDN-loaded) to render a full-screen interactive terminal in `index.html`. All terminal logic — data arrays, command dispatch, formatting, and configuration — lives in a single `<script>` block starting at `index.html:45`. No build step; test by opening `index.html` in a browser.

## Quick Start

### Terminal Initialization (`index.html:391`)

```javascript
$('body').terminal(function(command, term) {
    // command dispatch via switch/case at line 445
}, {
    prompt: '[[;red;][][[;green;]guest@geleus.io][[;red;]\\]][[;grey;]-][[;red;][][[;gold;]~\/resume][[;red;]\\]][[;orange;]: ]',
    greetings: "[[b;white;]ASCII banner...]",
    autocompleteMenu: true,
    completion: Object.keys(commands)
});
```

The interpreter function receives raw input as `command` and the terminal instance as `term`. Options configure prompt styling, greeting banner, and tab-completion from the `commands` object keys.

### Formatting Markup

```
[[b;red;]Bold red text]         — bold + foreground color
[[;grey;]Grey non-bold text]    — foreground only
[[b;white;]Section Header]      — bold white for headings
```

Format: `[[attributes;foreground;background]text]`. Attributes: `b` = bold, `i` = italic, `u` = underline.

## Key Concepts

| Concept | Location | Usage |
|---------|----------|-------|
| `term.echo()` | switch cases, ~line 445 | Render formatted string to terminal |
| `term.less()` | `echoArray()`, ~line 396 | Paginated output for long sections |
| `\r` terminator | all data arrays | Signals end of array element for spacing |
| `progressBar(n)` | `index.html:79` | Unicode block bar from 0-100 |
| `padKey(key, len)` | `index.html:88` | Right-pads strings for aligned columns |
| `echoArray(array)` | `index.html:396` | Renders array with `less` support |
| `commands` object | `index.html:49` | Registry for help text and autocomplete |

## Common Patterns

### Adding a New Command

1. Register in `commands` object (`index.html:49`):
```javascript
var commands = {
    help: "shows help",
    // ...existing entries
    newcmd: "description for help text",
};
```

2. Define data variable with formatted content above the `all` array (`index.html:373`):
```javascript
var newcmd = [
    '---\n' +
    '[[b;red;]Section Title]\n' +
    'Content here\n' +
    '\r',
];
```

3. Add `case` in the switch block (`index.html:445`):
```javascript
case 'newcmd':
    echoArray(newcmd);
    break;
```

4. Append to `all` array (`index.html:373`) if it belongs in full resume output.

Autocomplete works automatically — `completion: Object.keys(commands)` at `index.html:542` reads from the same `commands` object.

## WARNING: Inconsistent Output Method (Existing Bug)

The `certifications` case at `index.html:480` uses `term.echo(certifications)` directly instead of `echoArray(certifications)`. This bypasses `less` pagination. ALWAYS route array data through `echoArray()`.

## Configuration Options (`index.html:526-543`)

| Option | Value | Purpose |
|--------|-------|---------|
| `autocompleteMenu` | `true` | Dropdown menu on Tab |
| `completion` | `Object.keys(commands)` | Command names as candidates |
| `greetings` | ASCII art string | Banner on terminal load |
| `keydown` | Handler function | Blocks input during animation; Ctrl+D cancels |

## See Also

- [patterns](references/patterns.md) — formatting, data structures, progress bars, dispatch
- [workflows](references/workflows.md) — step-by-step for adding commands, editing content, deployment

## Related Skills

- See the **jquery** skill for DOM initialization and event handling
- See the **javascript** skill for JS conventions and data patterns
- See the **hugo** skill for how this HTML output was originally generated

---
name: javascript
description: |
  Manages terminal command logic, event handlers, and interactive resume data in a single-file jQuery terminal application.
  Use when: modifying terminal commands, editing resume data arrays, adding new commands, fixing command dispatch logic, updating progress bar rendering, or changing the loading animation.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# JavaScript Skill

All JavaScript lives in a single `<script>` block inside `index.html` (lines 45-546). No build step, no modules, no bundler. Resume data is defined as JS arrays/objects at the top, and a `switch` statement at line 445 dispatches terminal commands. See the **jquery-terminal** skill for terminal API and the **jquery** skill for DOM patterns.

## Adding a New Command

Step-by-step against `index.html`:

1. Add command to the `commands` object (line 49):

```javascript
var commands = {
    // ...existing entries...
    awards: "list awards and achievements",
};
```

2. Create the data variable in Zone 2 (between line 104 and 389):

```javascript
var awards = [
    '---\n' +
    '[[b;gold;]Dean\'s List]\n' +
    'Fall 2023\n' +
    'Utah Valley University\n' +
    '\r',
];
```

3. Add a `case` in the switch block (after line 445):

```javascript
case 'awards':
    echoArray(awards);
    break;
```

4. Add to `all` array (line 373) if it should show in `all` output:

```javascript
var all = [ whois, social(), work, /* ..., */ awards, source ];
```

5. Validate: open `index.html` in browser, type `awards`, then `less awards`, then verify autocomplete suggests it.

## Key Concepts

| Concept | Location | Usage |
|---------|----------|-------|
| `progressBar(n)` | line 79 | Unicode bar 0-100 for skill ratings |
| `padKey(k, len)` | line 88 | Right-pad strings for two-column output |
| `echoArray(arr)` | line 396 | Outputs array, routes to `less` if `useLess` is set |
| `loading()` | line 421 | Animated `[===>  ] XX%` bar via recursive `setTimeout` |
| `useLess` flag | line 393 | Set when input starts with `less`, checked by `echoArray` |
| `animation` flag | line 47 | Blocks keyboard during loading; `Ctrl+D` cancels |

## Command Parsing Flow

Input is split on whitespace at line 439. If first token is `less`, it shifts off and `useLess` becomes true. The remaining first token enters the `switch` at line 445.

```javascript
commands = command.split(/[ ]+/);
if (commands[0] == 'less') {
    useLess = true;
    commands.shift();
}
switch(commands[0]) { /* ... */ }
```

## Editing Resume Data

All data lives in Zone 2 (lines 104-389). Each section is a `string[]` with entries ending in `\r`. Use `+` concatenation for data arrays (matches existing style) and template literals only for computed strings like `social()`.

## Workflow: Updating a Skill's Progress Bar

1. Find the skill entry in the `skills` array (lines 248-288 in `index.html`)
2. Change both the `progressBar()` argument AND the displayed percentage string — they are independent values that must stay in sync:

```javascript
'[[b;blue;]Python:]\n' +
progressBar( 95 ) +    // ← update this number
'95' + '%\n' +         // ← AND this string
'\r',
```

3. Open `index.html`, type `skills`, confirm the bar matches the percentage.

## Validation Loop

1. Edit `index.html`
2. Open in browser (`open index.html`)
3. Test the modified command in the terminal
4. Check browser console (F12) for JS errors
5. If errors, fix in `index.html` and refresh — repeat from step 3

## See Also

- [patterns](references/patterns.md) — idiomatic patterns and anti-patterns
- [types](references/types.md) — data structures and formatting conventions
- [modules](references/modules.md) — code organization within the single file

## Related Skills

- See the **jquery-terminal** skill for terminal API, formatting syntax, and plugin configuration
- See the **jquery** skill for DOM manipulation and event handling patterns
- See the **frontend-design** skill for styling, colors, and visual layout
- See the **hugo** skill for how this HTML output was originally generated

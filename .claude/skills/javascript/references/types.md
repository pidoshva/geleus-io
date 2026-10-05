# Types & Data Structures Reference

## Contents
- Core Data Structures
- Commands Object Schema
- The `all` Meta-Array
- Data Variable Naming Conventions

## Core Data Structures

No TypeScript in this project. Data shapes are implicit. This reference documents the contracts enforced by convention.

### Resume Section Arrays

Every resume section is a `string[]`. Each element is one logical entry ending with `\r`.

```javascript
// Shape: string[] — each element ends with '\r'
// Location: index.html lines 182-195 (work example)
var work = [
    '---\n' +                          // visual separator
    '[[b;red;]Full-stack Developer]\n' + // colored header
    'Utah County Health Department\n' +  // plain text
    'Orem, UT\n' +
    'August 2024 - Present\n' +
    '\n' +
    '- Bullet point content\n' +
    '\r',                               // REQUIRED terminator
];
```

**Critical:** `\r` is not decorative. `echoArray()` iterates and echoes each element — `\r` ensures proper line separation. Omitting it causes entries to visually merge.

### Skills With Progress Bars

Skill entries embed `progressBar()` inline. The function argument and displayed percentage are independent — keep them in sync manually.

```javascript
// Location: index.html lines 248-288
'[[b;blue;]Python:]\n' +
progressBar( 90 ) +    // returns Unicode block string &#9611;&#9617;
'90' + '%\n' +         // displayed text — must match the number above
'\r',
```

### Commands Object

Maps command names to help descriptions. Also drives autocomplete via `Object.keys(commands)` at line 542.

```javascript
// Shape: Record<string, string>
// Location: index.html lines 49-77
var commands = {
    help: "shows help",
    whois: "list basic details",
    work: "list work experience",
    // ...
};
```

Adding a key here without a matching `case` in the switch means autocomplete suggests a command that returns "unknown command."

### Social Map

Internal to `social()` function at line 130. Maps platform names to URLs.

```javascript
// Shape: Record<string, string>
let sMap = {
    "github": "https://github.com/pidoshva",
    "instagram": "https://www.instagram.com/vp.id/",
};
```

## The `all` Meta-Array

Defined at line 373. Contains all section variables for the `all` command. Note the mix of arrays and raw strings, plus the `social()` function call:

```javascript
// Shape: Array<string[] | string>
var all = [
    whois,      // string[]
    social(),   // string[] — function call, not reference
    work,       // string[]
    education,  // string[]
    skills,     // string[]
    softSkills, // string[]
    languages,  // string[]
    projects,   // string[]
    certifications, // string[]
    misc,       // string[]
    source,     // string — ASCII art, not an array
];
// Flattened at line 492: all.flat(1)
```

When adding a new section, insert it before `source` (keep ASCII art last).

## Data Variable Naming Conventions

| Variable | Command | Type | Notes |
|----------|---------|------|-------|
| `help` | `help`, `?` | `string` | Built by `commandsHelp()` |
| `whois` | `whois` | `string[]` | lines 110-126 |
| `social()` | `social` | `fn → string[]` | line 128, only function-based section |
| `certifications` | `certifications` | `string[]` | lines 156-180 |
| `work` | `work` | `string[]` | lines 182-195 |
| `education` | `education` | `string[]` | lines 197-213 |
| `projects` | `projects` | `string[]` | lines 215-246 |
| `skills` | `skills` | `string[]` | lines 248-288 |
| `softSkills` | `softskills` | `string[]` | **Mismatch**: camelCase var, lowercase cmd |
| `languages` | `languages` | `string[]` | lines 320-342 |
| `misc` | `about` | `string[]` | **Mismatch**: var name differs from command |
| `source` | `source` | `string` | Not an array — single ASCII art string |

Naming mismatches (`softSkills` vs `softskills`, `misc` vs `about`) are legacy. For new commands, keep the variable name identical to the command name.

## Terminal Formatting Syntax

See the **jquery-terminal** skill for the full reference. Colors used per section:

| Section | Header Color | Markup |
|---------|-------------|--------|
| Work entries | red | `[[b;red;]Title]` |
| Education (BS) | red | `[[b;red;]Degree]` |
| Education (AS) | purple | `[[b;purple;]Degree]` |
| Projects | red/orange/blue | Varies by project |
| Field labels | grey | `[[b;grey;]Label:]` |
| Help headers | white | `[[b;white;]heading]` |
| Loading OK | green | `[[b;green;]OK]` |
| Loading FAIL | red | `[[b;red;]FAIL]` |

Match existing section colors when adding entries. Pick an unused color for new sections.

# jquery-terminal Patterns Reference

## Contents
- Formatting Markup
- Data Structure Conventions
- Progress Bar Rendering
- Command Dispatch
- Function-Based Commands

## Formatting Markup

All terminal output in `index.html` uses jquery.terminal's bracket syntax. Three patterns appear throughout:

```javascript
// Bold colored header (used for job titles, project names)
'[[b;red;]Full-stack Developer]\n'

// Bold grey label with tab-aligned value (used in whois, index.html:112)
'[[b;grey;]Name:]\t\t\tVadim Pidoshva\n'

// Colored block text (used in about section, index.html:347)
'[[;orange;]- I love coding, skiing, and camping.\n]'
```

Color names are CSS keywords. Colors used in this project: `red`, `grey`, `white`, `purple`, `blue`, `orange`, `green`, `yellow`, `cyan`, `magenta`, `teal`, `gold`.

### WARNING: Unclosed Formatting Brackets

**The Problem:**
```javascript
// BAD — missing closing bracket
'[[b;red;]Title text\n'
```

**Why This Breaks:** jquery.terminal applies formatting to ALL subsequent output until a closing `]` is found. This silently corrupts every command's output rendered after the broken one — not just the current section.

**The Fix:**
```javascript
// GOOD — properly closed
'[[b;red;]Title text]\n'
```

**When You Might Be Tempted:** When concatenating multi-line strings, it's easy to place `\n` inside the bracket instead of after. Always close `]` before `\n`.

## Data Structure Conventions

Resume sections use a consistent array-of-strings pattern. Each element is one logical block (one job, one project, one cert):

```javascript
// From index.html:182 — work experience
var work = [
    '---\n' +                              // visual separator
    '[[b;red;]Full-stack Developer]\n' +   // bold colored heading
    'Utah County Health Department\n' +     // plain text lines
    'Orem, UT\n' +
    'August 2024 - Present\n' +
    '\n' +                                  // blank line before details
    '- Developed a patient filtering software...\n' +
    '\r',                                   // element terminator — required
];
```

The `\r` at the end of each element creates visual spacing when `echoArray` iterates. Every array element MUST end with `'\r'`.

### WARNING: Missing `\r` Terminator

**The Problem:**
```javascript
// BAD — no \r
'[[b;red;]Title]\nContent\n',
```

**Why This Breaks:** Consecutive array elements render as one continuous block with no spacing. Sections become visually indistinguishable. This is especially confusing in the `all` command output.

**The Fix:**
```javascript
// GOOD — \r terminates the element
'[[b;red;]Title]\nContent\n' + '\r',
```

## Progress Bar Rendering

The `progressBar(n)` function at `index.html:79` generates Unicode block bars:

```javascript
// From index.html:251 — skills section
'[[b;blue;]Python:]\n' +
progressBar(90) +
'90' + '%\n' +
'\r',
```

`progressBar` maps 0-100 to 10 blocks using `&#9611;` (filled) and `&#9617;` (light shade). Always pair `progressBar(n)` with the matching numeric percentage string — the bar alone has no label.

## Command Dispatch

Commands are parsed at `index.html:439` by splitting on whitespace. The `less` prefix is detected and shifted before the switch:

```javascript
commands = command.split(/[ ]+/);
if (commands[0] == 'less') {
    useLess = true;
    commands.shift();
}
switch(commands[0]) {
    case 'work':
        echoArray(work);
        break;
    default:
        term.echo("\nunknown command: " + command + "\n" +
                  "please type 'help' or '?' for a list of available commands\n");
}
```

### WARNING: Bypassing `echoArray`

**The Problem:**
```javascript
// BAD — at index.html:480, bypasses less pagination
case 'certifications':
    term.echo(certifications);
    break;
```

**Why This Breaks:** `less certifications` silently ignores the `less` prefix. Users expect pagination but get direct output dump.

**The Fix:**
```javascript
// GOOD — respects useLess flag
case 'certifications':
    echoArray(certifications);
    break;
```

## Function-Based Commands

The `social` command at `index.html:128` uses a function instead of a static array because it builds output dynamically from a map using `padKey()` for alignment:

```javascript
function social() {
    let sMap = {
        "github": "https://github.com/pidoshva",
        "instagram": "https://www.instagram.com/vp.id/",
    };
    socialText = [];
    for (let key in sMap) {
        let longestKeyLength = Math.max(...Object.keys(sMap).map(key => key.length));
        socialText.push(`${padKey(key, longestKeyLength)}\t${sMap[key]}`);
    }
    return socialText;
}

// Dispatch at index.html:451 — call the function, don't reference a static var
case 'social':
    echoArray(social());
    break;
```

The `all` array at `index.html:373` calls `social()` at definition time. This is acceptable when the underlying data is static, but would cause stale results if the data were dynamic.

# jQuery Patterns Reference

## Contents
- Initialization Pattern
- Data Flow Pipeline
- WARNING: Direct DOM Manipulation
- WARNING: Missing var in Loop Variables
- WARNING: Implicit Globals in Closures
- Known Bug: certifications Bypasses echoArray

## Initialization Pattern

All jQuery code lives inside a single `document.ready` callback at `index.html:46`. The `$` alias is scoped via the callback parameter:

```javascript
// GOOD — $ is scoped, no global pollution (index.html:46)
jQuery(document).ready(function($) {
    $('body').terminal(function(command, term) {
        // command handler
    }, { /* terminal options */ });
});
```

```javascript
// BAD — relies on global $, breaks if another library claims it
$(document).ready(function() {
    $('body').terminal(/* ... */);
});
```

**Why this matters:** No `noConflict()` is called. The scoped pattern defends against future library additions at zero cost.

## Data Flow Pipeline

Resume data follows: JS array variable -> `echoArray()` at `index.html:396` -> `term.echo()`. Every section uses this pipeline:

```javascript
// 1. Data defined as array of formatted strings (e.g., index.html:182)
var work = [
    '---\n' +
    '[[b;red;]Full-stack Developer]\n' +
    'Utah County Health Department\n' +
    '\r',
];

// 2. Echoed through echoArray() which respects the less toggle
case 'work':
    echoArray(work);  // index.html:455-456
    break;
```

Rules:
- Array data MUST go through `echoArray()` — it handles `less` mode
- String data (e.g., `help`, `version`) can use `term.echo()` directly
- All section variables must be added to the `all` array at `index.html:373` to appear in `all` output

## WARNING: Direct DOM Manipulation

**The Problem:**

```javascript
// BAD — bypasses terminal, invisible to less, breaks UX
$('#output').html('<div>' + work.join('') + '</div>');
document.getElementById('result').innerHTML = data;
```

**Why This Breaks:**
1. The terminal owns `<body>` — injected elements create visual artifacts that overlap terminal output
2. Content won't appear in `less` mode or `all` output
3. jquery.terminal formatting syntax (`[[b;red;]text]`) only renders through `term.echo()`

**The Fix:**

```javascript
// GOOD — all output through terminal API
term.echo('[[b;red;]New content here]');
// For raw HTML, use: term.echo('<b>html</b>', {raw: true});
```

**When You Might Be Tempted:** Adding images, embedded widgets, or HTML-rich content. Use jquery.terminal's `{raw: true}` option instead.

## WARNING: Missing `var` in Loop Variables

**The Problem:**

```javascript
// BAD — i leaks to outer scope (this bug exists at index.html:400)
for (i = 0; i < array.length; i += 1) {
    term.echo(array[i]);
}
```

**Why This Breaks:**
1. `i` becomes an implicit global — nested `echoArray()` calls (via `all` command which flattens arrays) can corrupt the counter
2. Strict mode would throw a ReferenceError
3. Any future function sharing scope could collide

**The Fix:**

```javascript
// GOOD — properly scoped
for (var i = 0; i < array.length; i += 1) {
    term.echo(array[i]);
}
```

## WARNING: Implicit Globals in Closures

Several variables inside the command handler at `index.html:391` lack `var` declarations:

| Variable | Location | Should Be |
|----------|----------|-----------|
| `socialText` | `index.html:141` | `var socialText = []` |
| `prompt` | `index.html:423` | `var prompt = term.get_prompt()` |
| `string` | `index.html:424` | `var string = progress(0, size)` |
| `timer` | `index.html:431` | `var timer = setTimeout(loop, 10)` |

These all leak to the `document.ready` closure scope. While functionally harmless in the current code (the outer scope captures them), this is fragile — any refactoring that moves these functions could cause subtle bugs.

## Known Bug: certifications Bypasses echoArray

At `index.html:480`, `certifications` is echoed directly instead of through `echoArray()`:

```javascript
// BUG — less certifications doesn't paginate
case 'certifications':
    term.echo(certifications);  // index.html:480
    break;

// FIX — use echoArray like every other array section
case 'certifications':
    echoArray(certifications);
    break;
```

This means `less certifications` silently fails to paginate. Every other array-based command correctly routes through `echoArray()`.

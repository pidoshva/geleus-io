# JavaScript Patterns Reference

## Contents
- Idiomatic Patterns
- Anti-Patterns
- Error Handling
- String Building Conventions

## Idiomatic Patterns

### Array-Based Data Sections

Every resume section follows the same structure: a `string[]` where each element is one entry (a job, degree, project) terminated with `\r`.

```javascript
// GOOD — consistent section pattern from index.html line 197
var education = [
    '---\n' +
    '[[b;red;]Software Engineering B.S.]\n' +
    'August 2020 - May 2025\n' +
    '\r',
];
```

### Function-Based Dynamic Data

When data requires runtime computation (key padding, conditional display), use a function returning an array. Only `social()` (line 128) uses this pattern currently.

```javascript
// GOOD — function returns computed array (index.html line 128)
function social() {
    var hideName = false;
    let sMap = {
        "github": "https://github.com/pidoshva",
        "instagram": "https://www.instagram.com/vp.id/",
    };
    socialText = [];
    for (let key in sMap) {
        if (sMap.hasOwnProperty(key)) {
            let longestKeyLength = Math.max(...Object.keys(sMap).map(key => key.length));
            socialText.push(`${padKey(key, longestKeyLength)}\t${sMap[key]}`);
        }
    }
    return socialText;
}
```

### Switch-Case Command Dispatch

All commands route through the `switch` at line 445. Keep cases thin — call `echoArray()` or `term.echo()` and break.

```javascript
// GOOD — thin case delegates to echoArray (line 454)
case 'work':
    echoArray(work);
    break;

// GOOD — direct echo for scalar output (line 517)
case 'version':
    term.echo("1.0.0 (BETA)");
    break;
```

## Anti-Patterns

### WARNING: Missing `var`/`let`/`const` on Variables

**The Problem:**

```javascript
// BAD — implicit globals (exist in this codebase)
socialText = []                    // line 141 — leaks to window.socialText
timer = setTimeout(loop, 10)       // line 431 — leaks to window.timer
prompt = term.get_prompt()         // line 423 — shadows window.prompt
string = progress(0, size)         // line 424 — leaks to window.string
```

**Why This Breaks:**
1. Creates properties on `window`, polluting global scope
2. `prompt` shadows the browser's built-in `window.prompt` function
3. Concurrent `loading()` calls would clobber each other's `timer`

**The Fix:**

```javascript
// GOOD — always declare with let/const
let socialText = [];
let timer = setTimeout(loop, 10);
const prompt = term.get_prompt();
let string = progress(0, size);
```

### WARNING: Inconsistent `echoArray` vs `term.echo` for Arrays

**The Problem:**

```javascript
// BAD — certifications bypasses echoArray (line 480)
case 'certifications':
    term.echo(certifications);  // `less certifications` won't paginate
    break;
```

**Why This Breaks:** `echoArray()` checks `useLess` and routes to `term.less()`. Using `term.echo()` directly means `less certifications` silently ignores pagination.

**The Fix:**

```javascript
// GOOD — use echoArray for all array-type data
case 'certifications':
    echoArray(certifications);
    break;
```

### WARNING: Loop Variable `i` Without Declaration

```javascript
// BAD — `i` leaks to outer scope (line 400)
for (i = 0; i < array.length; i += 1) {

// GOOD
for (let i = 0; i < array.length; i += 1) {
```

## Error Handling

No `try/catch` exists in this codebase. The only error path is the `default` switch case at line 522:

```javascript
default:
    term.echo("\nunknown command: " + command + "\n" +
              "please type 'help' or '?' for a list of available commands\n");
```

If adding async operations (fetch, timers beyond loading), wrap in `try/catch` and echo errors to the terminal — never let them silently fail.

## String Building Conventions

The codebase mixes `+` concatenation and template literals. Follow whichever the surrounding code uses:

- **Data arrays** (Zone 2): Use `+` concatenation — matches `work`, `education`, `skills`, etc.
- **Computed strings**: Use template literals — matches `social()` at line 148
- **Terminal markup**: Always single-quoted `'[[b;color;]text]'` — NEVER use template literals for bracket syntax, as `${}` interpolation conflicts with the markup brackets

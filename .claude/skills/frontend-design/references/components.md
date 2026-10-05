# Components Reference

## Contents
- Progress Bars
- Section Entries
- Loading Animation
- Greeting Banner

## Progress Bars

`progressBar(n)` at `index.html:79-85` renders a 0-100 visual bar using Unicode block characters:

```javascript
function progressBar(number) {
    var barLength = Math.round(number / 10);
    var barFilled = Array(barLength + 1).join("&#9611;");  // ▋ filled
    var barBlank = Array(11 - barLength).join("&#9617;");  // ░ empty
    return barFilled + barBlank
}
```

Renders 10 character cells total. `&#9611;` (LOWER FIVE EIGHTHS BLOCK) for filled, `&#9617;` (LIGHT SHADE) for empty. The filled/empty contrast is high enough to be instantly readable.

### Usage Pattern for Skill-Type Sections

```javascript
'[[b;blue;]Python:]\n' +
progressBar(90) +
'90' + '%\n' +
'\r',
```

Structure: colored label, newline, bar + percentage on next line, carriage return terminator. The percentage is a raw string concatenated after the bar — not part of the bar function.

### DO / DON'T

```javascript
// GOOD — label and bar on separate lines
'[[b;blue;]Skill Name:]\n' + progressBar(80) + '80%\n\r'

// BAD — label and bar on same line (misaligns in narrow terminals)
'[[b;blue;]Skill Name:] ' + progressBar(80) + '80%\n\r'
```

**Why separate lines:** Progress bars are exactly 10 characters wide. Prepending a label pushes the bar rightward, and with long labels, the bar wraps mid-character on narrow viewports.

## Section Entries

Each resume entry follows a consistent visual template:

```javascript
'---\n' +                              // horizontal rule separator
'[[b;red;]Job Title]\n' +              // bold colored title
'Company Name\n' +                     // plain text
'Location\n' +                         // plain text
'Date Range\n' +                       // plain text
'\n' +                                 // blank line before details
'- Bullet point detail\n' +            // dash-prefixed details
'\r',                                  // array element terminator
```

The `---\n` prefix creates visual separation between entries in the same section. It appears as a plain text triple-dash, not an HTML `<hr>`.

### Field Labels (whois pattern)

```javascript
'[[b;grey;]Name:]\t\t\tVadim Pidoshva\n' +
'[[b;grey;]Profession:]\t\tSoftware Engineer\n'
```

Grey bold labels + tab alignment. The number of `\t` characters varies to achieve visual column alignment — this is manual and fragile. See `padKey()` for the programmatic alternative used in `commandsHelp()` and `social()`.

## Loading Animation

`progress()` and `loading()` at `index.html:406-437` render an animated loading bar in the prompt area:

```
[======>                       ] 23%
```

The animation replaces the prompt text using `term.set_prompt()` inside a `setTimeout` loop, incrementing from 0 to 100. On completion, it echoes the final state with `[[b;green;]OK]` or `[[b;red;]FAIL]` (on Ctrl+D cancel).

### WARNING: Animation Blocks Input

During `loading()`, the `keydown` handler at `index.html:530-539` returns `false` for all keypresses except Ctrl+D. This is intentional — the animation simulates a blocking process. Do not add interruptible animations without also updating the keydown guard.

## Greeting Banner

The `greetings` option at `index.html:528` renders on terminal initialization:

```javascript
greetings: "[[b;white;]...\n\nWelcome to Vadim's interactive resume!\n\nType 'help' for a list of available commands\n]"
```

The banner combines block-character name art with plain-text instructions, all wrapped in a single `[[b;white;]...]` markup block. The `BETA` label sits inline with the art, right-aligned by spacing.

### Modifying the Banner

1. Edit the string in the `greetings` option at `index.html:528`
2. Keep the outer `[[b;white;]...]` wrapper — removing it drops to default grey
3. The welcome text and help hint after the art are part of the same markup block
4. Test at multiple browser widths — block art wraps badly on mobile

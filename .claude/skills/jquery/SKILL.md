---
name: jquery
description: |
  Manages DOM manipulation, event handling, and terminal initialization for the geleus.io resume site.
  Use when: modifying terminal setup, changing DOM interactions, updating event handlers,
  adding jQuery-based features, or debugging page initialization in index.html.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# jQuery Skill

jQuery serves exactly one purpose in this project: bootstrapping the jquery.terminal plugin on `<body>`. There is zero standalone jQuery DOM manipulation — no `$.ajax()`, no `$('.class').html()`, no event binding outside the terminal config. All jQuery usage is confined to `index.html:46-544` inside a single `document.ready` callback.

## Terminal Initialization

The entire jQuery surface area — one ready handler wrapping one `.terminal()` call at `index.html:391`:

```javascript
// index.html:46 — entry point
jQuery(document).ready(function($) {
    var animation = false;
    var commands = { /* command registry */ };

    // Helper functions: progressBar(), padKey(), commandsHelp()
    // Data variables: whois, work, education, skills, etc.

    // index.html:391 — the single jQuery DOM call in the project
    $('body').terminal(function(command, term) {
        // Command dispatch — term.echo() for all output
    }, {
        prompt: '[[;red;]...]',
        greetings: "...",
        keydown: function(e, term) { /* animation guard */ },
        autocompleteMenu: true,
        completion: Object.keys(commands)
    });
});
```

## Key APIs Used

| jQuery API | Location | Purpose |
|------------|----------|---------|
| `jQuery(document).ready()` | `index.html:46` | Ensures DOM ready before terminal init |
| `$('body').terminal()` | `index.html:391` | Creates terminal instance — the only DOM call |
| `term.echo()` | switch cases ~line 445 | All visible output goes through this |
| `term.less()` | `index.html:398` | Paginated output when `less` prefix used |
| `term.set_prompt()` / `term.get_prompt()` | `index.html:425-429` | Loading animation prompt manipulation |

## Output Pattern: echoArray()

The standard way to render resume sections. Defined at `index.html:396-404`:

```javascript
function echoArray(array) {
    if (useLess) {
        term.less(array);    // Paginated mode
    } else {
        for (i = 0; i < array.length; i += 1) {
            term.echo(array[i]);  // Direct echo
        }
    }
}
```

NEVER call `term.echo()` directly on array data — it bypasses the `less` toggle. Note the existing bug at `index.html:480` where `certifications` uses `term.echo(certifications)` instead of `echoArray(certifications)`, breaking `less certifications`.

## Animation Guard Pattern

The `keydown` handler at `index.html:530-539` blocks input during loading animations and allows Ctrl+D cancellation:

```javascript
keydown: function(e, term) {
    if (animation) {
        if (e.which == 68 && e.ctrlKey) {  // Ctrl+D
            clearTimeout(timer);
            animation = false;
            term.echo(string + ' [[b;red;]FAIL]').set_prompt(prompt);
        }
        return false;  // Block all input during animation
    }
}
```

Three variables must stay in sync: `animation` (boolean flag), `timer` (setTimeout ref), `prompt` (saved original prompt). Forgetting to reset any of them after animation ends will freeze the terminal.

## WARNING: No jQuery Outside Terminal

This project has zero standalone jQuery DOM manipulation. NEVER add `$('.selector').html()`, `$.ajax()`, or event handlers outside the terminal config. All content goes through `term.echo()`. If you need to display something, add it as a terminal command.

## WARNING: Unpinned jQuery CDN

`index.html:25` loads jQuery without a version pin (`cdn.jsdelivr.net/npm/jquery`), fetching the latest major version. A jQuery 4.x release could break jquery.terminal 2.42.x compatibility. Pin it: `cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js`.

## See Also

- [patterns](references/patterns.md) — DO/DON'T pairs, known bugs, anti-patterns
- [workflows](references/workflows.md) — Step-by-step procedures for common tasks

## Related Skills

- See the **jquery-terminal** skill for formatting syntax, command dispatch, and plugin APIs
- See the **javascript** skill for data variables, helper functions, and command logic

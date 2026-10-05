# Modules & Code Organization Reference

## Contents
- File Layout
- Logical Zones
- Function Reference
- Dependency Chain
- Workflow: Locating Code

## File Layout

One JavaScript file: `index.html` lines 45-546. Everything lives inside a single `jQuery(document).ready()` callback. No ES modules, no imports, no bundler.

```
index.html <script> block (lines 45-546)
└── jQuery(document).ready(function($) {        // line 46
    ├── ZONE 1: Config & Utilities              // lines 47-102
    │   ├── animation (boolean flag)            // line 47
    │   ├── commands (object)                   // lines 49-77
    │   ├── progressBar(n)                      // lines 79-85
    │   ├── padKey(key, len)                    // lines 88-90
    │   └── commandsHelp()                      // lines 92-102
    ├── ZONE 2: Data Variables                  // lines 104-389
    │   ├── help, whois, social()              // lines 104-154
    │   ├── certifications, work, education    // lines 156-213
    │   ├── projects, skills, softSkills       // lines 215-318
    │   ├── languages, misc, source            // lines 320-371
    │   └── all (meta-array)                   // lines 373-389
    └── ZONE 3: Terminal Init                   // lines 391-544
        ├── $('body').terminal(callback, config)
        ├── Inner: echoArray(array)             // line 396
        ├── Inner: progress(percent, width)     // line 406
        ├── Inner: loading()                    // line 421
        ├── Command parsing + switch            // lines 439-525
        └── Terminal config object              // lines 526-543
```

## Logical Zones

### Zone 1: Config & Utilities (lines 47-102)

Top-level declarations available to all code below.

| Item | Line | Purpose |
|------|------|---------|
| `animation` | 47 | Boolean flag — blocks input during `loading()` |
| `commands` | 49-77 | Command name → help text map; drives autocomplete |
| `progressBar(n)` | 79-85 | Returns 10-char Unicode bar (`&#9611;` filled, `&#9617;` empty) |
| `padKey(key, len)` | 88-90 | Right-pads with spaces for columnar alignment |
| `commandsHelp()` | 92-102 | Builds formatted help output from `commands` object |

### Zone 2: Data Variables (lines 104-389)

Static resume content. Each variable maps 1:1 to a terminal command (with naming exceptions noted in [types.md](types.md)).

### Zone 3: Terminal Initialization (lines 391-544)

The `$('body').terminal(callback, config)` call. The callback receives every typed command. Inner functions are scoped to this callback — they cannot be called from Zone 1 or 2.

| Item | Line | Purpose |
|------|------|---------|
| `echoArray(arr)` | 396 | Standard output — checks `useLess`, routes to `echo` or `less` |
| `progress(pct, w)` | 406 | Renders `[===>   ] XX%` string for loading animation |
| `loading()` | 421 | Runs animated bar via recursive `setTimeout(loop, 10)` |

## Function Reference

### `progressBar(number) → string` (line 79)
Input: 0-100. Output: 10-char bar of filled (`&#9611;`) and empty (`&#9617;`) Unicode blocks. Used in `skills`, `softSkills`, `languages` data arrays.

### `padKey(key, length) → string` (line 88)
Pads `key` with spaces to `length`. Used in `commandsHelp()` and `social()`.

### `echoArray(array) → void` (line 396)
Iterates array, calls `term.echo()` per element. If `useLess` is true, calls `term.less(array)` instead. Use this for ALL array data — never call `term.echo()` directly on arrays.

### `loading() → void` (line 421)
Animates 0-100% progress bar at 10ms intervals. Sets `animation = true` to block keyboard input. On completion, echoes `OK` in green. Only `Ctrl+D` can interrupt (handled in `keydown` at line 530).

## Dependency Chain

```
CDN Scripts (synchronous, order guaranteed by <script> tags):
  1. jQuery (line 25)              → provides $
  2. jquery.terminal (line 26)     → provides $.fn.terminal, term.echo, term.less
  3. less.min.js (line 27)         → extends terminal with less() pagination
  4. autocomplete_menu.js (line 28)→ extends terminal with autocompleteMenu
```

See the **jquery** skill for jQuery specifics and the **jquery-terminal** skill for terminal API.

## Workflow: Locating Code

To find where a command is handled:

1. Search for the command in the `commands` object (lines 49-77) — confirms it exists and has help text
2. Search for `case 'commandname':` in the switch block (lines 445-525) — this is the dispatch logic
3. Find the corresponding data variable in Zone 2 (lines 104-389) — the variable name usually matches the command

To find where a utility function is defined:

1. Zone 1 functions (`progressBar`, `padKey`, `commandsHelp`): lines 79-102
2. Zone 3 inner functions (`echoArray`, `progress`, `loading`): lines 396-437

### WARNING: No Fallback for CDN Failures

If any CDN is unreachable, the site shows a blank page. No local fallback, no error boundary. Acceptable for a resume site — CDN uptime is effectively 100%. If adding features that depend on additional CDN resources, consider whether a fallback is warranted.

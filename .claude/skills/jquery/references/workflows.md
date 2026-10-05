# jQuery Workflows Reference

## Contents
- Adding a New Terminal Command
- Modifying the Loading Animation
- Testing Changes Locally
- Debugging Common Issues
- Updating CDN Dependencies

## Adding a New Terminal Command

All edits are in `index.html`. For formatting syntax, see the **jquery-terminal** skill.

Copy this checklist and track progress:
- [ ] Step 1: Add command to `commands` object at `index.html:49`
- [ ] Step 2: Create data variable after the existing data blocks (~line 349)
- [ ] Step 3: Add `case` in switch statement at `index.html:445`
- [ ] Step 4: Use `echoArray(variable)` for arrays, `term.echo(variable)` for strings
- [ ] Step 5: Add variable to `all` array at `index.html:373` if it belongs in `all` output
- [ ] Step 6: Test: command alone, `less <command>`, `all`, and autocomplete

Concrete example — adding an `awards` command:

```javascript
// Step 1: index.html ~line 49, add before the closing brace
    awards: "list awards and honors",

// Step 2: after misc variable (~line 349), add:
var awards = [
    '---\n' +
    '[[b;gold;]Dean\'s List]\n' +
    'Fall 2023\n' +
    '\r',
];

// Step 3-4: in switch block after the last case (~line 518), add:
case 'awards':
    echoArray(awards);
    break;

// Step 5: in all array (~line 373), add before source:
    awards,
```

## Modifying the Loading Animation

The animation at `index.html:421-437` uses `setTimeout` loops to animate the terminal prompt. Three outer-scope variables must stay synchronized:

| Variable | Purpose | Reset Required |
|----------|---------|----------------|
| `animation` | Guards keyboard input | Must be `false` when done |
| `timer` | `setTimeout` ref for Ctrl+D cancel | Cleared on cancel |
| `prompt` | Original prompt to restore | Must call `term.set_prompt(prompt)` |

Workflow for modifying:
1. Edit `progress()` at `index.html:406` to change bar appearance
2. Adjust `setTimeout(loop, 10)` at `index.html:431` to change speed (10ms = ~1 second total)
3. Edit completion message at `index.html:433`
4. Validate: run `startx` or `exit`, then test Ctrl+D cancellation
5. If Ctrl+D doesn't reset properly, check `keydown` handler at `index.html:530-539`

```javascript
// CRITICAL: both paths (completion + cancellation) must reset state
// Completion path (index.html:433-434):
term.echo(progress(i, size) + ' [[b;green;]OK]').set_prompt(prompt);
animation = false;

// Cancellation path (index.html:532-536):
clearTimeout(timer);
animation = false;
term.echo(string + ' [[b;red;]FAIL]').set_prompt(prompt);
```

## Testing Changes Locally

No build step required. Direct browser testing:

1. Edit `index.html`
2. Run `open /Users/vpid/Documents/Personal/geleus-io/index.html`
3. Test the modified command
4. If output is wrong, fix in `index.html` and refresh the browser
5. Repeat until all scenarios pass

Validation scenarios for any command change:
- [ ] Command outputs expected content
- [ ] `less <command>` paginates (not applicable if output is a single string)
- [ ] `all` includes the content (if added to `all` array)
- [ ] Autocomplete suggests the command name
- [ ] Ctrl+D works during `startx` and `exit` animations

Browser console access to the terminal instance:

```javascript
// Get terminal object for manual testing
var term = $('body').terminal();
term.echo('[[b;red;]test]');           // Test formatted output
term.options().completion;              // Inspect registered commands
```

## Debugging Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Terminal blank on load | jQuery CDN blocked or failed | Check browser network tab; pin jQuery version at `index.html:25` |
| "unknown command" for valid input | Missing `case` in switch at `index.html:445` | Add case matching the `commands` object key exactly |
| `less` shows no pagination | Command uses `term.echo()` not `echoArray()` | Route array data through `echoArray()` |
| New command missing from autocomplete | Not in `commands` object at `index.html:49` | Add entry — `completion: Object.keys(commands)` reads from it |
| Terminal frozen after animation | `animation` not reset to `false` | Ensure both completion and Ctrl+D paths set `animation = false` |
| Formatting brackets visible as text | Wrong syntax | Must be `[[b;color;]text]` — see the **jquery-terminal** skill |

## Updating CDN Dependencies

Current CDN references at `index.html:25-30`:

| Library | Line | Pinned? |
|---------|------|---------|
| jQuery | 25 | No — fetches latest |
| jquery.terminal JS | 26 | Yes — 2.42.2 |
| less plugin | 27 | No — fetches latest |
| autocomplete plugin | 28 | No — fetches latest |
| jquery.terminal CSS | 30 | Yes — 2.42.0 (mismatched with JS 2.42.2) |

Update procedure:
1. Check jquery.terminal release notes for breaking changes
2. Update all four `<script>` tags and the `<link>` tag in `index.html:25-30`
3. Align CSS and JS versions (currently mismatched: JS 2.42.2 vs CSS 2.42.0)
4. Pin all versions explicitly — unpinned URLs fetch latest and can break silently
5. Test all commands, especially `less` mode and autocomplete (plugin-dependent)
6. Test on both Chrome and Firefox — CDN caching behavior differs

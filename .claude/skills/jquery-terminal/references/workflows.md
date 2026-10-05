# jquery-terminal Workflows Reference

## Contents
- Adding a New Command
- Editing Existing Resume Content
- Adding a Skill with Progress Bar
- Prompt Customization
- Animation and Async Patterns
- Deployment

## Adding a New Command

All edits target `index.html`. Every step references a specific location in the file.

Copy this checklist and track progress:
- [ ] Step 1: Register command in `commands` object at `index.html:49`
- [ ] Step 2: Create data variable above the `all` array (before `index.html:373`)
- [ ] Step 3: Add `case` in switch block at `index.html:445`
- [ ] Step 4: Use `echoArray()` — never raw `term.echo()` for arrays
- [ ] Step 5: Add variable to `all` array at `index.html:373` if needed
- [ ] Step 6: Validate in browser (see validation loop below)

### Concrete Example: Adding a `hobbies` Command

Step 1 — Add to `commands` object after the `about` entry (~line 67):
```javascript
"about": "about me",
hobbies: "list hobbies and interests",
```

Step 2 — Define data variable before the `all` array (~line 370):
```javascript
var hobbies = [
    '[[b;cyan;]Hobbies]\n' +
    '- Skiing and snowboarding\n' +
    '- Weight training\n' +
    '\r',
];
```

Step 3 — Add case before the `default` in the switch (~line 520):
```javascript
case 'hobbies':
    echoArray(hobbies);
    break;
```

Step 4 — Add to `all` array at `index.html:373`:
```javascript
var all = [
    whois, social(), work, education, skills,
    softSkills, languages, projects, certifications, misc,
    hobbies,  // new
    source,
];
```

### Validation Loop

1. Open `index.html` in browser (`open index.html`)
2. Type `hobbies` — verify formatted output renders
3. Type `less hobbies` — verify pagination works
4. Type `all` — verify hobbies section appears in full output
5. Press Tab — verify `hobbies` appears in autocomplete menu
6. If any step fails, edit `index.html`, save, refresh browser, repeat from step 2

## Editing Existing Resume Content

Find the target variable by section name:

| Section | Variable | Location |
|---------|----------|----------|
| Bio | `whois` | `index.html:110` |
| Social links | `social()` | `index.html:128` |
| Certifications | `certifications` | `index.html:156` |
| Work | `work` | `index.html:182` |
| Education | `education` | `index.html:197` |
| Projects | `projects` | `index.html:215` |
| Skills | `skills` | `index.html:248` |
| Soft skills | `softSkills` | `index.html:290` |
| Languages | `languages` | `index.html:320` |
| About | `misc` | `index.html:344` |

### Adding a New Work Entry

Insert at the **beginning** of the `work` array for most-recent-first ordering (`index.html:182`):

```javascript
var work = [
    '---\n' +
    '[[b;red;]New Job Title]\n' +
    'Company Name\n' +
    'City, State\n' +
    'Month Year - Present\n' +
    '\n' +
    '- First achievement or responsibility\n' +
    '- Second achievement\n' +
    '\r',
    // existing entries follow
];
```

## Adding a Skill with Progress Bar

Append to the `skills` array at `index.html:248`. Pick a color not used by adjacent entries:

```javascript
'[[b;teal;]Kubernetes:]\n' +
progressBar(65) +
'65' + '%\n' +
'\r',
```

The `progressBar()` function at `index.html:79` maps 0-100 to 10 Unicode blocks. Always match the number inside `progressBar(n)` with the displayed percentage string.

## Prompt Customization

The prompt at `index.html:527` renders as: `[guest@geleus.io]-[~/resume]: `

```javascript
prompt: '[[;red;][][[;green;]guest@geleus.io][[;red;]\\]][[;grey;]-][[;red;][][[;gold;]~\/resume][[;red;]\\]][[;orange;]: ]',
```

Each `[[;color;]text]` segment is separately colored. Literal `[` and `]` characters appear outside formatting brackets. Backslash-escape forward slashes inside strings.

### WARNING: Unbalanced Prompt Brackets

A single missing `]` causes the entire terminal to render garbled output on every line — not just the prompt. Count bracket pairs carefully and test in browser immediately after any prompt change.

## Animation and Async Patterns

The `loading()` function at `index.html:421` animates a progress bar in the prompt area using `setTimeout` loops. During animation, the `keydown` handler at `index.html:530` blocks all input except Ctrl+D:

```javascript
keydown: function(e, term) {
    if (animation) {
        if (e.which == 68 && e.ctrlKey) {
            clearTimeout(timer);
            animation = false;
            term.echo(string + ' [[b;red;]FAIL]').set_prompt(prompt);
        }
        return false;  // blocks all input during animation
    }
},
```

The `animation` flag is module-scoped at `index.html:47`. The `startx` (line 496) and `exit` (line 509) commands both use `loading()` followed by a `setTimeout` redirect. NEVER start a second animation while one is running — the shared `timer` variable would be overwritten, orphaning the first animation's timeout.

## Deployment

No build step. No CI/CD. Push to `main` and GitHub Pages serves automatically.

```bash
git add index.html
git commit -m "description of change"
git push origin main
```

See the **hugo** skill for context on how this HTML was originally generated. Direct edits to `index.html` are the standard workflow since this repo contains built output only.

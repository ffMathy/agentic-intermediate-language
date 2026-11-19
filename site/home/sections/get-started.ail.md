# Get started

```ail
node GetStarted : view   level: experience
  why   Turn interest into a first try, from wherever the visitor already works: Claude Code or a terminal.   <- HomePage
  what
    two cards, "In Claude Code" and "In a terminal", side by side when there is room
    every command has its own copy button
    the terminal card lists the three commands that make up the whole tool
    Scenario: in Claude Code
      Given the page is open
      Then the card "In Claude Code" shows the commands "/plugin marketplace add ffMathy/agentic-intermediate-language" and "/plugin install ail@agentic-intermediate-language", in that order
    Scenario: in a terminal
      Given the page is open
      Then the card "In a terminal" shows the command "bun add -g github:ffMathy/agentic-intermediate-language"
      And a table lists "ail check", "ail build" and "ail show [what]", in that order, each with what it does
  look
    band      Section with id "start", tone raised
    head      SectionHeading with text from start.heading
    cards     a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(320px, 100%), 1fr)), gap space.6, align-items start
    card      background color.surface, a 1px solid color.border border, radius.lg, pad space.6, min-width 0; stack(v, gap: space.3, align: stretch)
    title     an h3: font.lead, weight 700, color.text, margin 0
    subtitle  a p: font.small, color.text.muted, margin 0
    commands  one CopyCommand per command
    text      a p: font.body, line-height 1.6, color.text.muted, margin 0
    table     width 100%, border-collapse collapse; every row has a 1px solid color.border bottom border; cells pad space.2 space.2 space.2 0, vertical-align top, font.small, text-align left
    command   the first cell in font.mono at font.code, weight 600, color.accent, white-space nowrap
    closing   a p: font.small, weight 600, color.text, margin 0
  copy
    start.heading          "Start in two minutes"
    start.claude.title     "In Claude Code"
    start.claude.subtitle  "No API key. It runs on your Claude subscription."
    start.claude.1         "/plugin marketplace add ffMathy/agentic-intermediate-language"
    start.claude.2         "/plugin install ail@agentic-intermediate-language"
    start.claude.text      "Then ask for features in plain words. Claude changes the spec, and /ail:build compiles whatever changed."
    start.cli.title        "In a terminal"
    start.cli.subtitle     "Needs Bun 1.2 or later."
    start.cli.1            "bun add -g github:ffMathy/agentic-intermediate-language"
    start.cli.col.command  "Command"
    start.cli.col.does     "What it does"
    start.cli.check        "ail check"
    start.cli.check.does   "Is the spec sound, is the code built from it, and does it pass every check?"
    start.cli.build        "ail build"
    start.cli.build.does   "Compile whatever changed."
    start.cli.show         "ail show [what]"
    start.cli.show.does    "The tree, a node, one reader's view, or what changed."
    start.cli.closing      "That's the whole tool: three commands."
  binds
    claude   a card with an h3 from start.claude.title, the subtitle, CopyCommand with start.claude.1, CopyCommand with start.claude.2, then the text
    cli      a card with an h3 from start.cli.title, the subtitle, CopyCommand with start.cli.1, the table with a header row, then the closing line
    cards    each card is a region named by its h3
  uses  Section, SectionHeading, Stack, CopyCommand
```

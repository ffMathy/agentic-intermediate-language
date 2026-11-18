```ail
node GetStarted : view   level: experience
  why   People start from where they already work: Claude Code or a terminal.   <- HomePage
  what
    two options, "In Claude Code" and "In a terminal", side by side when there is room
    each option has a title, one sentence, and its commands in a code block
    the section's heading can be linked to as #get-started
    Scenario: in Claude Code
      Given the page is open
      Then the code block named "Claude Code commands" shows the three Claude Code lines, in order
    Scenario: in a terminal
      Given the page is open
      Then the code block named "Terminal commands" shows the four terminal lines, in order
  look
    layout   stack(v, gap: space.4, align: stretch) [ SectionHeading, options ]
    options  a grid of columns at least 280px wide that wrap, as many as fit, gap space.4
    option   background color.surface.raised, radius.md, pad space.4; stack(v, gap: space.2, align: stretch) [ title, text, CodeBlock ]
    title    Text.body, weight 700
    text     Text.body, color.text.muted
  copy
    start.heading       "Get started"
    start.claude.title  "In Claude Code"
    start.claude.text   "No API key needed: it runs on your Claude subscription."
    start.claude.label  "Claude Code commands"
    start.claude.1      "/plugin marketplace add ffMathy/agentic-intermediate-language"
    start.claude.2      "/plugin install ail@agentic-intermediate-language"
    start.claude.3      "/ail:build"
    start.cli.title     "In a terminal"
    start.cli.text      "Needs Bun. Uses your Claude Code login, or ANTHROPIC_API_KEY when it is set."
    start.cli.label     "Terminal commands"
    start.cli.1         "bun add -g github:ffMathy/agentic-intermediate-language"
    start.cli.2         "ail check"
    start.cli.3         "ail build"
    start.cli.4         "ail show"
  binds
    heading  SectionHeading with id "get-started"
  uses  SectionHeading, CodeBlock
```

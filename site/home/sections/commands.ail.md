```ail
node Commands : view   level: experience
  why   The whole tool is three commands, and saying so lowers the barrier.   <- HomePage
  what
    a heading, then a table with a header row and one row per command: the command, and what it does
    Scenario: three commands
      Given the page is open
      Then the table's rows read "ail check", "ail build" and "ail show", in that order, each with its description
  look
    layout   stack(v, gap: space.4, align: stretch) [ SectionHeading, table ]
    table    full width, collapsed borders; every row has a 1px color.border line below it
    header   Text.body, weight 700, left aligned
    cells    pad space.2 above and below, space.4 left and right; vertically aligned to the top
    command  font.code, monospace, color.accent, never wrapping
  copy
    commands.heading      "Three commands"
    commands.col.command  "Command"
    commands.col.does     "What it does"
    commands.check        "ail check"
    commands.check.does   "Is the spec sound, is the code built from it, and does the code pass every check the spec implies?"
    commands.build        "ail build"
    commands.build.does   "Compile whatever changed, through Claude Code or any model, and reject anything that fails its checks."
    commands.show         "ail show"
    commands.show.does    "The tree, a single node, a view for one audience, or what changed, ready for review."
  uses  SectionHeading
```

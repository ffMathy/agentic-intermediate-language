# Adopt an existing app

AIL in reverse: for an app that already exists, write its spec from what is
there, prove the spec describes it, and from then on build from the spec,
on the same stack or a new one.

```ail
node AdoptSection : view   level: experience
  why   Most software already exists: show that AIL can take over an existing app, and carry it to a new technology without changing what it does.   <- HomePage
  what
    the section has the id "adopt", so the page can link to it
    a heading, a picture of an old app and a new app checked against the same spec, four steps that write and prove the spec, and the two commands that do it
    the picture comes before the steps
    Scenario: adopting is explained
      Given the page is open
      Then the section with the id "adopt" has the level 2 heading "Already have an app? Adopt it."
      And it has the level 3 headings "Why, from people and tickets", "What, from the running app", "How, from the code" and "Proof, on the old app", in that order
      And it shows the commands "/ail:adopt" and "ail adopt"
  look
    band      Section with id "adopt", tone plain
    layout    stack(v, gap: space.6, align: stretch) [ head, figure, steps, commands, note ]
    head      SectionHeading with eyebrow from adopt.eyebrow, text from adopt.heading, lead from adopt.lead
    figure    a div: background color.surface.raised, radius.lg, pad space.6, overflow hidden; holding AdoptFigure
    steps     an ol styled directly (not a Stack): list-style none, margin 0, pad 0, display grid, grid-template-columns repeat(auto-fit, minmax(min(240px, 100%), 1fr)), gap space.4
    step      an li styled directly: background color.surface, a 1px solid color.border border, radius.lg, pad space.6, display flex, flex-direction column, gap space.2; holding [ number, title, text ]
    number    a span showing the step's number from copy (adopt.n1 to adopt.n4): display block, font.display at 32px, weight 800, line-height 1; why color.level.product, what color.level.experience, how color.level.system, proof color.pass
    title     an h3: font.lead, weight 700, color.text, margin 0
    text      a p: font.body, line-height 1.6, color.text.muted, margin 0
    commands  a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(320px, 100%), 1fr)), gap space.4; holding two cards
    card      background color.surface, a 1px solid color.border border, radius.lg, pad space.6, min-width 0; stack(v, gap: space.3, align: stretch) [ card.title, CopyCommand, card.text ]
    card.title  an h3: font.lead, weight 700, color.text, margin 0
    card.text   a p: font.small, line-height 1.6, color.text.muted, margin 0
    note      a p: font.small, line-height 1.6, color.text.muted, max-width width.prose, margin 0
  copy
    adopt.eyebrow     "AIL IN REVERSE"
    adopt.heading     "Already have an app? Adopt it."
    adopt.lead        "Most software already exists. AIL can write the spec of an app you already have, prove that the spec describes it, and from then on build it from that spec, on the same technology or a new one."
    adopt.n1          "1"
    adopt.n2          "2"
    adopt.n3          "3"
    adopt.n4          "4"
    adopt.1.title     "Why, from people and tickets"
    adopt.1.text      "The reasons come from the task tracker (Asana, Jira, Linear) and from interviewing the people who own the app. A reason nobody can confirm is written down as unknown, and every build lists it until someone answers."
    adopt.2.title     "What, from the running app"
    adopt.2.text      "An agent finds out how to start the app, whatever it is: a website, a mobile app on a simulator, a command-line tool. Then it drives every screen and error path, and writes down what it sees, quirks included."
    adopt.3.title     "How, from the code"
    adopt.3.text      "The code tells what the screen can't: data shapes, rules, edge cases and timing. Real inputs and outputs become examples, and every claim records where it came from."
    adopt.4.title     "Proof, on the old app"
    adopt.4.text      "Every flow gets an end-to-end check that plays its scenarios and screenshots the screen each one ends on, on any platform. ail adopt starts the old app, runs them, commits the screenshots, and records the app as built, so the first build only builds what changes."
    adopt.claude.title  "In Claude Code"
    adopt.claude.cmd    "/ail:adopt"
    adopt.claude.text   "Claude writes the spec one slice at a time: a screen, a flow or a rule. It asks you what only the owners know."
    adopt.cli.title     "In a terminal"
    adopt.cli.cmd       "ail adopt"
    adopt.cli.text      "Starts the app as ail.config.json says, runs every end-to-end check against it, and stops it."
    adopt.note        "To move to another technology, change the spec's target and build. Every build then runs the same end-to-end checks against the new app, so it is proven to behave like the old one."
  binds
    claude   a card with an h3 from adopt.claude.title, CopyCommand with adopt.claude.cmd, then a p from adopt.claude.text
    cli      a card with an h3 from adopt.cli.title, CopyCommand with adopt.cli.cmd, then a p from adopt.cli.text
    cards    each card is a region named by its h3
  uses      Section, SectionHeading, Stack, CopyCommand, AdoptFigure
  children  AdoptFigure
```

```ail
node AdoptFigure : view   level: experience
  why   Show the whole idea at a glance: one spec in the middle, proved against the old app and then against the new one.   <- AdoptSection
  what
    three boxes in a row, "Your app today", "AIL spec" and "Your app, rebuilt", joined by arrows; the spec box in the middle is dark like the code panels, and under the row a line says the same checks pass on both
    Scenario: the picture
      Given the section is shown
      Then an image named "An existing app is described by an AIL spec, which builds a new app; the same checks pass on both" is shown
      And it contains the texts "Your app today", "AIL spec" and "Your app, rebuilt"
  look
    svg       viewBox 0 0 960 240, width 100%, height auto, display block
    boxes     rects y 40 width 240 height 120 rx 12: x 20 fill color.surface, stroke color.border, stroke-width 2; x 360 fill color.code; x 700 fill color.surface, stroke color.border, stroke-width 2
    titles    text-anchor middle, font-size 20, weight 700, at y 92: "Your app today" at x 140 fill color.text; "AIL spec" at x 480 fill color.thread, font.display; "Your app, rebuilt" at x 820 fill color.text
    subs      text-anchor middle, font-size 14, at y 122: "any stack" at x 140 fill color.text.muted; "why · what · how" at x 480 fill color.code.text; "any stack" at x 820 fill color.text.muted
    arrows    two lines, stroke color.accent, stroke-width 3: 268,100 to 350,100 and 608,100 to 690,100; each ends in a path, fill color.accent: "M340 92 L354 100 L340 108 Z" and "M680 92 L694 100 L680 108 Z"
    labels    text-anchor middle, font-size 13, weight 600, fill color.accent, at y 84: "adopt" at x 309; "build" at x 649
    checks    a path "M140 160 V196 H820 V160", fill none, stroke color.pass, stroke-width 2, stroke-dasharray 6 6
    pass      a rect x 330 y 182 width 300 height 30 rx 15 fill color.pass; on it, text at 480, 202, text-anchor middle, font-size 14, weight 700, fill color.on.accent
  copy
    adopt.figure.label  "An existing app is described by an AIL spec, which builds a new app; the same checks pass on both"
    adopt.figure.pass   "✓ the same checks pass on both"
  binds
    svg       role img with aria-label from adopt.figure.label
```

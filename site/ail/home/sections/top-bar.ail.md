# Top bar

```ail
node TopBar : view   level: experience
  why   Visitors should always know where they are and reach the main parts of the page in one click.   <- HomePage
  what
    the name of the project on the left, and six links on the right
    when there is not enough room, the links wrap under the name
    Scenario: the links lead to the right places
      Given the page is open
      Then the navigation named "Sections" has the links "The journey", "Four readers", "How it builds", "Browse the specs", "Get started" and "GitHub ↗", in that order
      And they lead to "#journey", "#readers", "#loop", "#specs", "#start" and the repository
  look
    bar       a header element: full width, background color.surface, a 1px solid color.border bottom border, box-sizing border-box, pad space.3 space.4
    row       inside, a div with max-width width.content, margin 0 auto; stack(h, gap: space.4, align: center, justify: between, wrap: true) [ brand, nav ]
    brand     stack(h, gap: space.2, align: center, wrap: true) [ wordmark, name ]
    wordmark  font.sans at 20px, weight 800, color.accent, letter-spacing -0.01em
    name      font.small, color.text.muted
    nav       a nav element; stack(h, gap: space.4, align: center, wrap: true) [ links ]
    link      font.small, weight 600, color.text, no underline, pad space.1 0
  copy
    bar.wordmark  "AIL"
    bar.name      "Agentic Intermediate Language"
    bar.nav       "Sections"
    bar.journey   "The journey"
    bar.readers   "Four readers"
    bar.loop      "How it builds"
    bar.self      "Browse the specs"
    bar.start     "Get started"
    bar.github    "GitHub ↗"
  binds
    nav      aria-label from bar.nav
    journey  a link to "#journey"
    readers  a link to "#readers"
    loop     a link to "#loop"
    self     a link to "#specs"
    start    a link to "#start"
    github   a link to "https://github.com/ffMathy/agentic-intermediate-language"
  uses  Stack
```

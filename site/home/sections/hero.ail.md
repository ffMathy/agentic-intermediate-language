```ail
node Hero : view   level: experience
  why   Say what AIL is before anything else, and offer the three next steps.   <- HomePage
  what
    shows the name, the pitch, one sentence of explanation, and three links
    Scenario: the links go to the right places
      Given the page is open
      Then "Get started" leads to the get started section of this page
      And "Try the demo" leads to the demo
      And "GitHub" leads to the repository
  look
    layout   stack(v, gap: space.4, align: start, pad: space.8) [ name, pitch, explanation, links ]
    name     font.hero, weight 800, color.accent, no margin; it is the page's level 1 heading
    pitch    font.heading, weight 600, color.text
    explanation  Text.body, color.text.muted, at most 640px wide
    links    stack(h, gap: space.4, align: center) [ start, demo, github ]
    link     a native link: pad space.2 above and below and space.4 left and right, radius.md, font.body, weight 600, no underline
    start    background color.action, text color.action.text, a 1px color.action border
    others   background color.surface, text color.text, a 1px color.border border
  copy
    hero.name         "AIL"
    hero.pitch        "Write the spec. Let agents build the code. Prove that they agree."
    hero.explanation  "AIL is a recursive why / what / how specification. People review the spec; any model compiles it; every check it implies runs against the result."
    hero.start        "Get started"
    hero.demo         "Try the demo"
    hero.github       "GitHub"
  binds
    start    a link to "#get-started"
    demo     a link to "./demo/"
    github   a link to "https://github.com/ffMathy/agentic-intermediate-language"
```

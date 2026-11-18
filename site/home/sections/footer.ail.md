```ail
node Footer : view   level: experience
  why   Point to the deeper material for those who want it.   <- HomePage
  what
    one row of three links, separated by space
    Scenario: the links
      Given the page is open
      Then "Design" leads to the design document, "Source" to the repository, and "Demo spec" to the demo's spec
  look
    layout   stack(h, gap: space.4, align: center, pad: space.6) [ design, source, demo ]
    border   a 1px color.border line above
    links    Text.body, color.text.muted
  copy
    footer.design  "Design"
    footer.source  "Source"
    footer.demo    "Demo spec"
  binds
    design   a link to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/proposal.md"
    source   a link to "https://github.com/ffMathy/agentic-intermediate-language"
    demo     a link to "https://github.com/ffMathy/agentic-intermediate-language/tree/main/examples/tictactoe"
```

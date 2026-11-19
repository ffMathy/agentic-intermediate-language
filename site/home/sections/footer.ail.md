# Footer

```ail
node Footer : view   level: experience
  why   Close the page by restating that everything on it was built the way it describes, and point to the deeper material.   <- HomePage
  what
    a strip of the four level colors, one sentence on where this page and the game came from, and four links
    Scenario: the links
      Given the page is open
      Then "GitHub" leads to the repository, "Design proposal" to the design document, "Claude Code guide" to the Claude Code guide and "This site's spec" to the site's spec folder
  look
    bar       a footer element: background color.code, color color.code.muted, font.small
    strip     a div at the top, height 4px, display flex; four equal children with flex 1, colored color.level.product, color.level.experience, color.level.system and color.level.specialist
    inner     a div with max-width width.content, margin 0 auto, box-sizing border-box, pad space.8 space.4; stack(v, gap: space.4, align: start) [ text, links ]
    text      a p: line-height 1.6, max-width width.prose, margin 0
    links     a nav element; stack(h, gap: space.4, align: center, wrap: true) [ github, proposal, guide, spec ]
    link      color color.code.text, weight 600, underline
  copy
    footer.text      "This page was compiled from site/*.ail.md, and the game from examples/tictactoe/*.ail.md. Apart from the spec and a short index.html, nothing in either was written by hand."
    footer.nav       "More about AIL"
    footer.github    "GitHub"
    footer.proposal  "Design proposal"
    footer.guide     "Claude Code guide"
    footer.spec      "This site's spec"
  binds
    links     aria-label from footer.nav
    github    a link to "https://github.com/ffMathy/agentic-intermediate-language"
    proposal  a link to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/proposal.md"
    guide     a link to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/claude-code.md"
    spec      a link to "https://github.com/ffMathy/agentic-intermediate-language/tree/main/site"
  uses  Stack
```

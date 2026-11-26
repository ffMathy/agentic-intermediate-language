# Hero

The first screen: what AIL is, in one breath, and the one sentence the rest of
the page follows.

More nodes, each in a folder of its own: [`HeroFigure`](hero-figure/hero-figure.ail.md).

```ail
node Hero : view   level: experience
  why   Say what AIL is before anything else, and set up the single sentence the page follows.   <- HomePage
  what
    an eyebrow, the page's only level 1 heading, a short explanation, three links and a note, beside a picture of the sentence sinking through the levels
    on a narrow screen the picture moves under the text
    Scenario: the links go to the right places
      Given the page is open
      Then "Follow the sentence ↓" leads to "#journey"
      And "Try to beat the computer ↓" leads to "#stop-8"
      And "View on GitHub ↗" leads to the repository
  look
    band      Section, tone plain
    grid      a div: display grid, grid-template-columns repeat(auto-fit, minmax(min(320px, 100%), 1fr)), gap space.8, align-items center
    text      stack(v, gap: space.4, align: start) [ eyebrow, headline, subhead, links, note ]
    eyebrow   a p: font.tiny, weight 700, letter-spacing 0.08em, color color.stop.text, background color.accent.soft, a 1px solid color.border border, radius.lg, pad space.1 space.3, margin 0
    headline  an h1: font.display at font.hero, weight 800, line-height 1.05, letter-spacing -0.02em, color.text, margin 0, max-width 16ch
    subhead   a p: font.lead, line-height 1.6, color.text.muted, max-width 52ch, margin 0
    links     stack(h, gap: space.3, align: center, wrap: true) [ follow, play, github ]
    follow    a link: background color.accent, color color.on.accent, a 2px solid color.accent border, radius.pill, pad space.3 space.6, weight 700, no underline, flex 1 1 auto, white-space nowrap, text-align center, box-sizing border-box (each fits its text on one line; on a phone each fills its own row)
    play      a link: background transparent, color color.text, a 2px solid color.text border, radius.pill, pad space.3 space.6, weight 700, no underline, flex 1 1 auto, white-space nowrap, text-align center, box-sizing border-box (each fits its text on one line; on a phone each fills its own row)
    github    a link: color color.text, weight 600, pad space.3 0, no underline
    note      a p: font.small, color.text.muted, margin 0
    picture   HeroFigure, centered in its column
  copy
    hero.eyebrow   "AIL, SAID LIKE THE ALE · A SPEC LANGUAGE FOR AI-BUILT SOFTWARE"
    hero.headline  "Write one sentence. Watch it become working software."
    hero.subhead   "Write what you want in plain words, then add detail level by level. AI agents build the code from it, checks prove it does what you wrote, and everyone on the team reviews the level written for them."
    hero.follow    "Follow the sentence ↓"
    hero.play      "Try to beat the computer ↓"
    hero.github    "View on GitHub ↗"
    hero.note      "This website is itself written in AIL and compiled by the same tool."
  binds
    follow   a link to "#journey"
    play     a link to "#stop-8"
    github   a link to "https://github.com/ffMathy/agentic-intermediate-language"
  uses      Section, Stack, HeroFigure
  children  HeroFigure
```

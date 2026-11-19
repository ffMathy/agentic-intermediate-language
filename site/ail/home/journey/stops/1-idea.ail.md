# Stop 1: the idea

```ail
node StopIdea : view   level: experience
  why   The journey starts where every project starts: a sentence anyone could say.   <- Journey
  what
    the first stop, in the accent color, before any level of the spec
    Scenario: the idea
      Given the page is open
      Then the article "stop-1" has the level 3 heading "It starts as a sentence anyone could say."
      And the region named "The idea, at the top of the spec" shows its four lines, with "The computer never loses." highlighted
  look
    stop     JourneyStop with number 1, color color.accent, figure IdeaFigure, browse "#spec/tictactoe/tictactoe.ail.md"
  copy
    idea.depth      "idea"
    idea.chip       "IDEA"
    idea.reader     "a product owner, in their own words"
    idea.headline   "It starts as a sentence anyone could say."
    idea.body       "Every AIL project starts with someone saying what they want, in plain words. Here it's a game people can finish in under a minute, and a promise that the built-in opponent can't be beaten. Those words go into the spec just as they were said, at the top of the tree. Nothing here is technical yet, and it shouldn't be."
    idea.label      "The idea, at the top of the spec"
    idea.file       "examples/tictactoe/ail/tictactoe.ail.md"
    idea.line.1     "  why   A quick, familiar game people can finish in under a minute,"
    idea.line.2     "        alone or with a friend on the same device."
    idea.line.3     "  …"
    idea.line.4     "    4. The computer never loses."
    idea.highlight  "The computer never loses."
    idea.turns      "The owner's words, written down unchanged as the spec's first lines. Next, the sentence joins the product's other promises and gets a node that keeps it."
  binds
    stop     JourneyStop with depth idea.depth, chip idea.chip, reader idea.reader, headline idea.headline, explanation idea.body, lines idea.line.1 to idea.line.4, label idea.label, file idea.file, highlight [idea.highlight], turnsInto idea.turns
  uses      JourneyStop, IdeaFigure
  children  IdeaFigure
```

```ail
node IdeaFigure : view   level: experience
  why   Show that the starting point is a person saying something, not a document.   <- StopIdea
  what
    a speech bubble saying "The computer never loses." over a simple person labelled "product owner", with "never loses." highlighted
    Scenario: the picture
      Given the stop is shown
      Then an image named "A product owner says: The computer never loses." is shown
  look
    svg        viewBox 0 0 320 180, width 100%, max-width 320px, height auto, display block
    tail       path "M48 92 L40 118 L74 92" fill color.surface, stroke color.border, stroke-width 2, drawn first
    bubble     rect x 10 y 10 width 300 height 84 rx 16, fill color.surface, stroke color.border, stroke-width 2
    highlight  rect x 78 y 58 width 164 height 30 rx 4, fill color.thread
    line.1     text at 160, 44, text-anchor middle, font-size 24, weight 700, fill color.text
    line.2     text at 160, 81, text-anchor middle, font-size 24, weight 700, fill color.text
    head       circle cx 40 cy 136 r 10, fill color.text.muted
    body       rect x 22 y 150 width 36 height 24 rx 12, fill color.text.muted
    who        text at 70, 160, font-size 12, fill color.text.muted
  copy
    idea.figure.label  "A product owner says: The computer never loses."
    idea.figure.1      "The computer"
    idea.figure.2      "never loses."
    idea.figure.who    "product owner"
  binds
    svg        role img with aria-label from idea.figure.label
```

# Section heading

```ail
node SectionHeading : view   level: experience
  why   Every section opens the same way: an optional eyebrow, a heading, and one lead paragraph.   <- Parts
  what
    shows the eyebrow when given, the text as a level 2 heading, and the lead when given, in that order
    Scenario: a full heading
      Given the eyebrow "THE JOURNEY", the text "Follow one sentence all the way down" and the lead "Read on."
      Then a level 2 heading reads "Follow one sentence all the way down"
      And "THE JOURNEY" is shown above it and "Read on." below it
    Scenario: just a heading
      Given only the text "Start in two minutes"
      Then a level 2 heading reads "Start in two minutes" and nothing else is shown
  look
    layout   stack(v, gap: space.3, align: start) [ eyebrow, heading, lead ]
    eyebrow  a p: font.tiny, weight 700, letter-spacing 0.12em, color.accent, margin 0
    heading  an h2: font.display at font.heading, weight 700, line-height 1.1, letter-spacing -0.01em, color.text, margin 0
    lead     a p: font.lead, line-height 1.6, color.text.muted, max-width width.prose, margin 0
  binds
    props    text: text, eyebrow?: text, lead?: text
  uses  Stack
```

# Section

```ail
node Section : view   level: experience
  why   Every band of the page has the same width, gutters and breathing room.   <- Parts
  what
    a full-width band with a centered content column; anchor links can land on it by its id
    Scenario: an anchored band
      Given the id "journey" and the child text "Hello"
      Then a region element with the id "journey" contains "Hello"
  look
    band     a section element, full width, box-sizing border-box; pad clamp(40px, 10vw, 64px) above and below, space.4 left and right
    tone     background color.surface when tone is "plain", color.surface.raised when tone is "raised"
    column   a div with max-width width.content, margin 0 auto, width 100%; stack(v, gap: space.8, align: stretch) [ children ]
    anchor   scroll-margin-top space.4 on the band
  binds
    props    id?: text, tone: "plain" | "raised", label?: text, children
    element  a section element with the given id and, when label is given, aria-label set to it
  uses  Stack
```

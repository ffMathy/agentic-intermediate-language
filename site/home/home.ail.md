# Home page

```ail
node HomePage : flow   level: experience
  why   One page, read top to bottom, that answers what AIL is, why it exists and how to start.   <- AIL
  what
    the sections appear in this order: Hero, Steps, SpecSample, GetStarted, Commands, Footer
    Scenario: everything is on one page
      Given the page is open
      Then the level 2 headings read "Spec, build, check", "What a spec looks like", "Get started" and "Three commands", in that order
  look
    layout   stack(v, gap: space.12, align: stretch, pad: space.6) [ Hero, Steps, SpecSample, GetStarted, Commands, Footer ]
    width    at most 880px, centered horizontally on the page
  binds
    state    none
  uses      Hero, Steps, SpecSample, GetStarted, Commands, Footer
  children  Hero, Steps, SpecSample, GetStarted, Commands, Footer
```

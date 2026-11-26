# Stop 3: experience level

More nodes, each in a folder of its own: [`ExperienceFigure`](experience-figure/experience-figure.ail.md).

```ail
node StopExperience : view   level: experience
  why   Show the experience level: the promise shows up as what the player sees, written as scenarios anyone can test.   <- Journey
  what
    the third stop, in the experience color
    Scenario: the experience level
      Given the page is open
      Then the article "stop-3" has the level 3 heading "Experience level: what the player sees, as scenarios anyone can test."
      And the region named "Experience-level spec excerpt" shows its eleven lines, with "the computer places an O" highlighted
  look
    stop     JourneyStop with number 3, color color.level.experience, figure ExperienceFigure, browse "#spec/tictactoe/app/play/play.ail.md"
  copy
    experience.depth     "depth 2"
    experience.chip      "EXPERIENCE"
    experience.reader    "design, QA and product"
    experience.headline  "Experience level: what the player sees, as scenarios anyone can test."
    experience.body      "One level down, the play screen describes the computer's answer as a Given / When / Then scenario. Decisions record why, and what was rejected: the computer waits 300 ms, so the player's own move feels like it counted."
    experience.label     "Experience-level spec excerpt"
    experience.file      "examples/tictactoe/ail/app/play/play.ail.md"
    experience.line.1    "node PlayAGame : flow   level: experience"
    experience.line.2    "  …"
    experience.line.3    "    Scenario: the computer answers"
    experience.line.4    "      Given the opponent is the computer"
    experience.line.5    "      When X picks a square"
    experience.line.6    "      Then shortly after, the computer places an O"
    experience.line.7    "      And the status says "X's turn" again"
    experience.line.8    "  how"
    experience.line.9    "    decide the computer answers after 300 ms"
    experience.line.10   "      because an instant answer feels like the player's own move didn't count"
    experience.line.11   "      rejected a random pause because it makes behaviour unpredictable and tests slow"
    experience.mark      "the computer places an O"
    experience.turns     "A test that plays X and waits for the computer's O, and a 300 ms timer in the play screen."
  binds
    stop     JourneyStop with depth experience.depth, chip experience.chip, reader experience.reader, headline experience.headline, explanation experience.body, lines experience.line.1 to experience.line.11, label experience.label, file experience.file, highlight [experience.mark], turnsInto experience.turns
  uses      JourneyStop, ExperienceFigure
  children  ExperienceFigure
```

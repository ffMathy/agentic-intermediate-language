import { JourneyStop } from "../journey-stop";
import { ExperienceFigure } from "./experience-figure";

/** the third stop, in the experience color */
export function StopExperience() {
  return (
    <JourneyStop
      number={3}
      color="color.level.experience"
      depth="depth 2"
      chip="EXPERIENCE"
      reader="design, QA and product"
      headline="Experience level: what the player sees, as scenarios anyone can test."
      explanation="One level down, the play screen describes the computer's answer as a Given / When / Then scenario. Decisions record why, and what was rejected: the computer waits 300 ms, so the player's own move feels like it counted."
      lines={[
        "node PlayAGame : flow   level: experience",
        "    Scenario: the computer answers",
        "      Given the opponent is the computer",
        "      When X picks a square",
        "      Then shortly after, the computer places an O",
        "      And the status says \"X's turn\" again",
        "  how",
        "    decide the computer answers after 300 ms",
        "      because an instant answer feels like the player's own move didn't count",
        "      rejected a random pause because it makes behaviour unpredictable and tests slow",
      ]}
      label="Experience-level spec excerpt"
      file="examples/tictactoe/app/play/play.ail.md"
      highlight={["the computer places an O"]}
      turnsInto="A test that plays X and waits for the computer's O, and a 300 ms timer in the play screen."
      figure={<ExperienceFigure />}
    />
  );
}

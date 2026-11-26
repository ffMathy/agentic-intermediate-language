# The adopt walkthrough

A team has an old Tic-Tac-Toe web app with no spec. Someone opens a new AIL
project folder, `tictactoe-ail/`, next to it in Claude Code and asks
`/ail:adopt` to bring its play screen under AIL, prove that the spec describes
the app, and then rebuild it on a new stack. Every output line is a real
format of the tools; the old app, its folder, its start command and its
`api` service are made up for the story. The screenshots are the demo's own,
committed with its checks.

More nodes in this folder, each in a file of its own: [`AdoptFirstHalf`](adopt-first-half.ail.md), [`AdoptSecondHalf`](adopt-second-half.ail.md).

```ail
node AdoptWalkthrough : data   level: system
  why   Show how an existing app comes under AIL, chapter by chapter, from the first request to the proof and a new stack.   <- WalkthroughPlayer
  what
    ADOPT: Walkthrough = { command: "/ail:adopt ../legacy-tictactoe \"the play screen\"", place: "Claude Code · tictactoe-ail/", picture: "tictactoe-ail/ spec, written node by node", rest: "unwritten", beats: the five beats of ADOPT_FIRST_HALF, then the five of ADOPT_SECOND_HALF, in their order }
    examples
      ADOPT.beats.length => 10
      totalSeconds(ADOPT) => 98
      clock(totalSeconds(ADOPT)) => "1:38"
      chapterStart(ADOPT, 3) => 26
      ADOPT.beats[0].title => "An old app, no spec"
      stateOf(ADOPT, 0, "PlayAGame") => "slice"
      stateOf(ADOPT, 0, "App") => "unwritten"
      stateOf(ADOPT, 7, "App") => "adopted"
      stateOf(ADOPT, 7, "BoardView") => "proven"
      stateOf(ADOPT, 9, "Rules") => "fresh"
      statesIn(ADOPT) => ["fresh", "writing", "checking", "unwritten", "slice", "written", "adopted", "proven"]
  how
    decide the terminal never shows the open question's reason in full
      because the site's own spec would then carry that marker, and every build of the site would list it as an open question of its own
      rejected quoting it verbatim because the warning would be false: the site has no unconfirmed reason
  uses      Walkthrough, AdoptFirstHalf, AdoptSecondHalf
  children  AdoptFirstHalf, AdoptSecondHalf
```

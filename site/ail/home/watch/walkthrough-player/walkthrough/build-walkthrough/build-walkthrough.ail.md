# The build walkthrough

In `examples/tictactoe`, someone speeds up the demo: in WatchADemo's spec they
change "600 ms" to "500 ms" on five lines, then run `ail build`. The rest of
the project is already built and passing. Every terminal line is a real
output format of `ail build`; the rejected first attempt and the STOP branch
are illustrative.

More nodes, each in a folder of its own: [`BuildFirstHalf`](build-first-half/build-first-half.ail.md), [`BuildSecondHalf`](build-second-half/build-second-half.ail.md).

```ail
node BuildWalkthrough : data   level: system
  why   Show what one ail build does with a small spec change, chapter by chapter, from the edit to the checked result.   <- WalkthroughPlayer
  what
    BUILD: Walkthrough = { command: "ail build", place: "terminal · examples/tictactoe", picture: "Tic-Tac-Toe spec · 16 nodes", rest: "fresh", beats: the five beats of BUILD_FIRST_HALF, then the five of BUILD_SECOND_HALF, in their order }
    examples
      BUILD.beats.length => 10
      totalSeconds(BUILD) => 85
      clock(totalSeconds(BUILD)) => "1:25"
      chapterStart(BUILD, 2) => 15
      BUILD.beats[0].lines[0] => "$ ail build"
      BUILD.beats[1].lines.length => 0
      BUILD.beats[6].branch => true
      BUILD.beats[5].branch => false
      stateOf(BUILD, 1, "App") => "stale"
      stateOf(BUILD, 1, "Rules") => "fresh"
      stateOf(BUILD, 6, "WatchADemo") => "stopped"
      stateOf(BUILD, 6, "App") => "skipped"
      stateOf(BUILD, 3, "Button") => "contract"
      stateOf(BUILD, 3, "TicTacToe") => "fresh"
      statesIn(BUILD) => ["fresh", "stale", "writing", "compiling", "contract", "checking", "rejected", "stopped", "skipped", "proven"]
  how
    decide the stop chapter is the only branch
      because it shows what would happen with a half-made edit, then the walkthrough rejoins the main path, where all five lines were changed
  uses      Walkthrough, BuildFirstHalf, BuildSecondHalf
  children  BuildFirstHalf, BuildSecondHalf
```

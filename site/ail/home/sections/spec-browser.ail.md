# Spec browser

Both example specs, browsable like code. The files are not copied into the
spec by hand: `ail build` writes them into a data module (the `specModule`
in ail.config.json), so the browser always shows the current specs, including
the one that describes this browser. The proof screenshots are in the same
tree, beside the spec they prove, exactly where they are in the repository.

```ail
node SpecBrowser : flow   level: experience
  why   Reading real specs is the fastest way to learn AIL, so both example specs can be browsed the way developers read code.   <- HomePage
  what
    the section has the id "specs", so the page can link to it
    two projects can be browsed: the Tic-Tac-Toe demo and this website; the demo is shown first
    for the shown project: how big its spec is (counted from the spec itself: how many nodes, in how many files, with how many screenshots), its spec files and its proof screenshots together, grouped by folder as they are in the repository (each screenshot in the shots/ folder beside its node's spec file), and the picked one: a spec file in a read-only editor, a screenshot as the image itself
    at first the demo's root file is picked: the top of its spec; showing another project picks its first file
    a link anywhere on the page can open a file here: when the page address ends with "#spec/", a project's key, "/" and the path of one of its spec files or screenshots, that project and file are shown and this section scrolls into view
    following such a link again works too, even when the page address already ends with it
    below 600px viewport width the file list is a drop-down of the same files, so the editor follows straight after it, and the size line is left out
    under the browser, one line points to the language definition, which says what every part of a spec means
    Scenario: the demo's spec is shown first
      Given the page is open
      Then the project "Tic-Tac-Toe demo" is shown as picked
      And the file "tictactoe.ail.md" is shown as picked
      And the region named "Source of tictactoe.ail.md" contains "node TicTacToe : system"
    Scenario: picking another file
      Given the page is open
      When the visitor picks the file "board/board-view.ail.md"
      Then "board/board-view.ail.md" is shown as picked and "tictactoe.ail.md" is not
      And the region named "Source of board/board-view.ail.md" contains "node BoardView : view"
    Scenario: showing this website's spec
      Given the page is open
      When the visitor picks the project "This website"
      Then that project is shown as picked and its first file is picked
      And the size line reads the website's number of nodes and of files
    Scenario: a screenshot beside its spec
      Given the page is open
      When the visitor picks the file "board/shots/board-view/01-picking-an-empty-square.png"
      Then that file is shown as picked
      And the image named "Screenshot at the end of the check “picking an empty square”" is shown
      And the folder "board/shots/board-view/" is listed after the file "board/board-view.ail.md"
    Scenario: opened from a link
      Given the page address ends with "#spec/tictactoe/app/play/play.ail.md"
      When the page opens
      Then the project "Tic-Tac-Toe demo" and the file "app/play/play.ail.md" are shown as picked
    Scenario: the language is defined
      Given the page is open
      Then the section with the id "specs" has a link "the language definition" that leads to the language definition
    Scenario: following the same link twice
      Given the page address ends with "#spec/tictactoe/app/play/play.ail.md" and the page is open
      When the visitor picks the file "tictactoe.ail.md"
      And the visitor clicks a link on the page to "#spec/tictactoe/app/play/play.ail.md"
      Then the file "app/play/play.ail.md" is shown as picked again
  look
    band      Section with id "specs", tone raised
    layout    stack(v, gap: space.6, align: stretch) [ head, window, language ]
    head      SectionHeading with eyebrow from browse.eyebrow, text from browse.heading, lead from browse.lead
    window    a div: radius.lg, overflow hidden, a 1px solid color.code.border border, background color.code, box-shadow 0 12px 32px rgba(15, 23, 42, 0.18)
    titlebar  a div: display flex, flex-wrap wrap, align-items center, gap space.3, pad space.1 space.3, background color.code.bar, a 1px solid color.code.border bottom border; holding [ dots, projects, size ]
    dots      an aria-hidden div with three 10px circles 6px apart: color.dot.red, color.dot.amber, color.dot.green
    projects  a div with role group named by browse.projects: display flex, gap space.1; one project button per project
    project   a button with type "button": font.small, weight 600, min-height 44px, pad space.1 space.3, radius.md, border none, background transparent, color color.code.muted, cursor pointer; the picked one instead has background color.code.pick and color color.code.text
    size      a p with class "ail-wide": margin 0 0 0 auto, font.mono at font.tiny, color color.code.muted
    body      a div: display flex, flex-wrap wrap; holding [ SpecTree, editor ]
    editor    a div: flex 999 1 420px, min-width 0, max-width 100%, overflow hidden, height clamp(380px, 120vw, 560px); holding SpecEditor for a spec file, or SpecShot for a screenshot
    language  a p: margin 0, font.body, line-height 1.6, color.text.muted, max-width width.prose; the text browse.language.before, then the link, then browse.language.after; the link: color color.accent, weight 600, underline
  copy
    browse.eyebrow    "Dogfooding"
    browse.heading    "Browse the specs"
    browse.lead       "Read both example specs the way you read code: the Tic-Tac-Toe demo, and this website itself, which is written in AIL and compiled by ail build too. Every screenshot that proves a part of the spec sits in a shots/ folder beside it. The files come straight from the repository at build time, so they are always current."
    browse.size       "{nodes} nodes in {files} files, {shots} screenshots"
    browse.projects   "Projects"
    browse.source     "Source of {path}"
    browse.language.before  "Every section, the notation for types and values, and the rules ail build enforces are in "
    browse.language.link    "the language definition"
    browse.language.after   ". A spec never uses a programming language's syntax: each compiler translates it into its target's own conventions."
  binds
    data      specProjects from the spec module, in this order: "tictactoe" (the demo), then "site" (this website)
    state     project: text, the shown project's key, starting at "tictactoe"; file: text, the picked file's path, starting at "tictactoe.ail.md"
    language  the link leads to "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md"
    hash      open(hash): when hash starts with "#spec/", the rest up to its first "/" is a project key and the remainder a path; if that project has a file or a shot with that path, show both and scroll the section element into view
    links     call open(location.hash) on mount and on every hashchange event of window; also listen for click events on document, and when the click's target is inside an a element whose href attribute starts with "#spec/", call open with that attribute (a link equal to the current address fires no hashchange); remove both listeners on unmount
    project   one button per entry of specProjects, in order, showing its name; aria-pressed true on the shown one; pressing another one shows it and picks its first file
    size      nodes is the shown project's nodeCount, files the number of its files, shots the number of its shots
    editor    when the picked path is a file's: SpecEditor with text = the picked file's text, path = the shown project's key + "/" + the picked path, label = browse.source with {path} filled in with the picked path
    shot      when the picked path is a shot's: SpecShot with that shot's node, test, path and src
    tree      SpecTree with files = the shown project's file paths, shots = its shot paths, picked = the picked path, onPick(path) picks that path
  uses  Section, SectionHeading, SpecEditor, SpecShot, SpecTree, Stack
  children  SpecTree
```

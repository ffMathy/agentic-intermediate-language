# Spec tree

The spec browser's file list: a project's spec files and its proof
screenshots in one tree, as they are in the repository, so every spec folder
shows its own screenshots right after its files.

```ail
node SpecTree : flow   level: experience
  why   The screenshots are part of the spec folder they prove, so the list shows them where they are: beside the spec, not in a separate place.   <- SpecBrowser
  what
    the spec files and the screenshots together, grouped by folder, the picked one marked
    at 600px viewport width or more, a list of folders and files; below it, a drop-down of the same files
    whenever the picked path changes, the list scrolls so the picked file is in view, without moving the page
    Scenario: screenshots beside their spec
      Given the files "app/app.ail.md", "app/play/play.ail.md" and "board/board.ail.md", the shots "app/shots/app/01-a.png" and "board/shots/board-view/01-b.png", and the picked path "board/board.ail.md"
      Then the list reads, in order: the folder "app/", "app.ail.md", the folder "app/shots/app/", "01-a.png", the folder "app/play/", "play.ail.md", the folder "board/", "board.ail.md", the folder "board/shots/board-view/", "01-b.png"
      And "board/board.ail.md" is shown as picked
  look
    explorer  a nav with class "ail-wide" named by tree.files: flex 1 1 220px, max-height clamp(200px, 40vw, 560px), overflow-y auto, background color.code.side, pad space.2 0, box-sizing border-box
    picker    a select with class "ail-narrow" named by tree.files: width 100%, min-height 44px, box-sizing border-box, font.mono at font.small, color color.code.text, background color.code.side, border none, a 1px solid color.code.border bottom border, pad space.2 space.3
    folder    a div: font.mono at font.tiny, color color.code.muted, pad space.1 space.3, padding-left calc(space.3 + 12px × (depth − 1)), where depth counts the "/" in the folder path plus one
    file      a button with type "button": display block, width 100%, text-align left, font.mono at font.tiny, color color.code.text, background transparent, border none, a 2px solid transparent left border, pad space.1 space.3, padding-left calc(space.3 + 12px × depth), where depth counts the "/" in the path, cursor pointer; the picked one instead has background color.code.pick and a 2px solid color.accent left border
    mark      a picture entry in the list shows tree.mark before its name, in color color.thread, aria-hidden
  copy
    tree.files  "Spec files"
    tree.mark   "▣ "
  binds
    props     files: list of text, shots: list of text, picked: text, onPick(path)
    order     the picker first, then the explorer, as siblings with no wrapper, so they sit in the parent's row
    entries   the files and the shots together, each a path, in explorer order: compare two paths folder by folder (the parts between "/"); where they first differ, an entry directly in that folder comes before anything in a subfolder, a subfolder named "shots" comes before the other subfolders, and otherwise the parts are compared by name; so every folder lists its own files first, then its shots/, then its other subfolders
    list      the entries in that order; before an entry whose folder (its path up to the last "/") differs from the previous entry's folder, a folder row showing that folder followed by "/"; entries at the top level have no folder row
    file      shows the file name (the path after its last "/"), after the mark when it is a shot; its accessible name and title are the full path; aria-pressed true on the picked one; pressing it picks that path
    picker    one option per entry, in that order, each showing its full path and having it as its value; consecutive entries in the same folder share one optgroup labelled with that folder followed by "/", and top-level entries are options outside any optgroup; its value is the picked path, and changing it picks that path
    scroll    an effect on picked, the only one: when it changes, if its entry is outside the explorer's visible area, set the explorer's scrollTop so the entry is in view; never call scrollIntoView, so the page does not move
```

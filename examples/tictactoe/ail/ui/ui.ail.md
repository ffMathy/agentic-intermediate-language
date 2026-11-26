# UI kit

The few building blocks every screen is made of. They are ordinary nodes,
specified and compiled like the rest of the game. Only the variants the game
actually uses exist.

More nodes, each in a folder of its own: [`Stack`](stack/stack.ail.md), [`Text`](text/text.ail.md), [`Button`](button/button.ail.md), [`Segmented`](segmented/segmented.ail.md).

```ail
node UiKit : library   level: experience
  why   Every screen is built from the same few parts, so the game looks consistent everywhere.   <- TicTacToe
  children  Stack, Text, Button, Segmented
```

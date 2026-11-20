# AIL for VS Code

Syntax highlighting for [AIL](https://github.com/ffMathy/agentic-intermediate-language),
the Agentic Intermediate Language: the ```` ```ail ```` blocks in `.ail.md`
files (and in any Markdown file), and bare `.ail` files.

It colors statements (`node`, `target`, `catalog`, `glossary`), node names,
kinds and levels, sections (`why`, `what`, `how`, `look`, …), `<- Ancestor`
links and `refined-by:` lists, scenarios and their Given/When/Then steps,
decisions (`decide`, `because`, `rejected`), examples (`=>`), AIL's types
(`text`, `list of T`, `later T`, `nothing`), design tokens, quoted text and
`;` comments. It uses standard scope names, so every color theme shows it.

The language itself is defined in
[docs/language.md](https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md).

## Install

Download `ail.vsix` from the repository's latest `vscode-v…`
[release](https://github.com/ffMathy/agentic-intermediate-language/releases)
(each new version in `package.json` is released when it reaches `main`), or
build it:

```bash
cd editors/vscode && bunx @vscode/vsce package --skip-license -o ail.vsix
```

Then, in VS Code, run **Extensions: Install from VSIX…** and pick the file,
or:

```bash
code --install-extension ail.vsix
```

The same grammar works in Cursor and other editors built on VS Code, and it is
the grammar a future GitHub highlighting submission (Linguist) would use.

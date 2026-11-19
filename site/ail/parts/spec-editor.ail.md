# Spec editor

A read-only code editor (Monaco, the editor inside VS Code) for spec files.
Monaco loads from a CDN at runtime; until then, and wherever it cannot load,
the same text is shown as a plain code block.

```ail
node SpecEditor : view   level: experience
  why   Specs are read like code, so they are shown in the editor developers already know, and never changed there.   <- Parts
  what
    shows the given text in a read-only code editor with AIL colours, line numbers and wrapped lines
    while the editor is loading, or wherever it cannot load, the same text is shown as a plain code block, so the text is always readable
    the text can be selected and copied, never changed
    Scenario: readable before the editor loads
      Given the text "node A : fn   level: system" and the label "Source of a.ail.md"
      Then the region named "Source of a.ail.md" contains "node A : fn   level: system"
  look
    box       a div: width 100%, height 100%, min-height 320px, background color.code
    editor    the Monaco editor filling the box, theme "ail-dark"
    fallback  CodeBlock with the text's lines and the label, inside a div with height 100% and overflow-y auto
  binds
    props     text: string, path: string, label: string
    lines     the text split on line breaks, without a trailing empty line
    editor    the default export Editor of @monaco-editor/react with value = text, path = "ail:" + path, language "ail", theme "ail-dark", height "100%", loading = the fallback, and options: readOnly true, domReadOnly true, minimap enabled false, wordWrap "on", lineNumbers "on", scrollBeyondLastLine false, fontSize 13, fontFamily "Inconsolata, ui-monospace, monospace", renderLineHighlight "none", automaticLayout true, padding top 12 and bottom 12, ariaLabel = label
    language  in beforeMount, only if no registered language has the id "ail": register the language "ail" and set its Monarch tokenizer to one root state with these rules, in this order:
                /^#.*$/ → "keyword.md"
                /^```.*$/ → "comment"
                /(^|\s);.*$/ → "comment"
                /"[^"]*"/ → "string"
                /<-\s*\w+/ → "type"
                /refined-by:/ → "type"
                /^(node|target|catalog|glossary)\b/ → "keyword"
                /^\s+(why|what|how|look|copy|binds|free|uses|children|verify|entry|tokens|term|decide|because|rejected|examples|probes)\b/ → "keyword"
                /\b(Scenario:|Given|When|Then|And)\b/ → "tag"
                /\blevel:\s*\w+/ → "attribute.name"
                /@\w+/ → "attribute.name"
                /=>/ → "operator"
                /\b[A-Z][A-Za-z0-9]*\b/ → "type.identifier"
    theme     also in beforeMount: define the theme "ail-dark" with base "vs-dark", inherit true, rules keyword #c4b5fd bold, keyword.md #f8fafc bold, comment #64748b, string #fde68a, type #6ee7b7, type.identifier #93c5fd, tag #f9a8d4, attribute.name #fdba74, operator #e2e8f0, and colors editor.background #0f172a, editorLineNumber.foreground #475569, editorGutter.background #0f172a
  uses  CodeBlock
```

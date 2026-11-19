import Editor, { type BeforeMount } from "@monaco-editor/react";
import { CodeBlock } from "./code-block";

const beforeMount: BeforeMount = (monaco) => {
  if (!monaco.languages.getLanguages().some((language) => language.id === "ail")) {
    monaco.languages.register({ id: "ail" });
    monaco.languages.setMonarchTokensProvider("ail", {
      tokenizer: {
        root: [
          [/^#.*$/, "keyword.md"],
          [/^```.*$/, "comment"],
          [/^;.*$/, "comment"],
          [/\s;.*$/, "comment"],
          [/"[^"]*"/, "string"],
          [/<-\s*\w+/, "type"],
          [/refined-by:/, "type"],
          [/^(node)(\s+)(\w+)/, ["keyword", "white", "type.identifier"]],
          [/^(target|catalog|glossary)\b/, "keyword"],
          [
            /^\s+(why|what|how|look|copy|binds|free|uses|children|verify|entry|tokens|term|decide|because|rejected|examples|probes)\b/,
            "keyword",
          ],
          [/Scenario:/, "tag"],
          [/\b(Given|When|Then|And)\b/, "tag"],
          [/\blevel:\s*\w+/, "attribute.name"],
          [/@\w+/, "attribute.name"],
          [/=>/, "operator"],
        ],
      },
    });
  }
  monaco.editor.defineTheme("ail-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "#c4b5fd", fontStyle: "bold" },
      { token: "keyword.md", foreground: "#f8fafc", fontStyle: "bold" },
      { token: "comment", foreground: "#64748b" },
      { token: "string", foreground: "#fde68a" },
      { token: "type", foreground: "#6ee7b7" },
      { token: "type.identifier", foreground: "#93c5fd" },
      { token: "tag", foreground: "#f9a8d4" },
      { token: "attribute.name", foreground: "#fdba74" },
      { token: "operator", foreground: "#e2e8f0" },
    ],
    colors: {
      "editor.background": "#0f172a",
      "editorLineNumber.foreground": "#475569",
      "editorGutter.background": "#0f172a",
    },
  });
};

/** shows the given text in a read-only code editor with AIL colours, line numbers and wrapped lines */
export function SpecEditor({
  text,
  path,
  label,
}: {
  text: string;
  path: string;
  label: string;
}) {
  const lines = text.split(/\r?\n/);
  if (lines.length > 1 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  const fallback = (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <CodeBlock lines={lines} label={label} />
    </div>
  );
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "320px",
        background: "var(--color-code)",
      }}
    >
      <Editor
        value={text}
        path={"ail:" + path}
        language="ail"
        theme="ail-dark"
        height="100%"
        loading={fallback}
        beforeMount={beforeMount}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          fontSize: 13,
          fontFamily: "Inconsolata, ui-monospace, monospace",
          renderLineHighlight: "none",
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          ariaLabel: label,
        }}
      />
    </div>
  );
}

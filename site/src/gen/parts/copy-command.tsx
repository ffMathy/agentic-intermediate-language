import { useEffect, useState } from "react";
import { Stack } from "./stack";

export type CopyCommandProps = {
  command: string;
};

/** "pressing "Copy" puts exactly the command on the clipboard; once that succeeds the button reads "Copied" for 1.5 seconds, then "Copy" again" */
export function CopyCommand({ command }: CopyCommandProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const id = setTimeout(() => {
      setCopied(false);
    }, 1500);
    return () => {
      clearTimeout(id);
    };
  }, [copied]);

  const onPress = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }
    navigator.clipboard.writeText(command).then(
      () => {
        setCopied(true);
      },
      () => {},
    );
  };

  return (
    <Stack
      dir="h"
      gap="space.3"
      align="center"
      justify="between"
      pad="space.3"
      style={{
        background: "var(--color-code)",
        borderRadius: "var(--radius-md)",
        minWidth: 0,
      }}
    >
      <code
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-code)",
          lineHeight: 1.5,
          color: "var(--color-code-text)",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          flex: "1 1 auto",
          minWidth: 0,
        }}
      >
        {command}
      </code>
      <button
        type="button"
        aria-label={`Copy ${command}`}
        onClick={onPress}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--font-tiny)",
          fontWeight: 600,
          color: "var(--color-code-text)",
          background: "transparent",
          border: "1px solid var(--color-code-border)",
          borderRadius: "var(--radius-sm)",
          padding: "var(--space-2) var(--space-3)",
          minHeight: "36px",
          cursor: "pointer",
          flex: "0 0 auto",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </Stack>
  );
}

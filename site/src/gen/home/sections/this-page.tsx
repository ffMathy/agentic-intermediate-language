import { useState } from "react";
import { specFiles, specNodes } from "../../spec";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { CodeBlock } from "../../parts/code-block";
import { Stack } from "../../parts/stack";

/** "a heading, one sentence, how big this page's spec is, a list of its spec files, and the source of the picked file" */
export function ThisPage() {
  const [picked, setPicked] = useState<string>("home/sections/this-page.ail.md");
  const file = specFiles.find((f) => f.path === picked);
  const lines = (file ? file.text : "").split(/\r?\n/);
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  return (
    <Section id="this-page" tone="raised">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="Dogfooding"
          text="This page is written in AIL, too"
          lead="Everything above was compiled from these files by ail build. They are read from the spec at build time, so this is always the spec this page was built from."
        />
        <p
          style={{
            fontSize: "var(--font-small)",
            fontWeight: 700,
            color: "var(--color-accent)",
            margin: 0,
          }}
        >
          {`${specNodes.length} nodes in ${specFiles.length} files`}
        </p>
        <div role="group" aria-label="Spec files of this page">
          <Stack dir="h" gap="space.2" align="center" wrap={true}>
            {specFiles.map((f) => {
              const isPicked = f.path === picked;
              return (
                <button
                  key={f.path}
                  type="button"
                  aria-pressed={isPicked}
                  onClick={() => setPicked(f.path)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--font-tiny)",
                    padding: "var(--space-1) var(--space-3)",
                    borderRadius: "var(--radius-pill)",
                    border: isPicked
                      ? "1px solid var(--color-accent)"
                      : "1px solid var(--color-border)",
                    background: isPicked
                      ? "var(--color-accent)"
                      : "var(--color-surface)",
                    color: isPicked
                      ? "var(--color-on-accent)"
                      : "var(--color-text)",
                    cursor: "pointer",
                  }}
                >
                  {f.path}
                </button>
              );
            })}
          </Stack>
        </div>
        <div
          style={{
            maxHeight: "560px",
            overflowY: "auto",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border)",
            background: "var(--color-code)",
          }}
        >
          <CodeBlock
            lines={lines}
            label={`Source of ${picked}`}
            caption={picked}
          />
        </div>
      </Stack>
    </Section>
  );
}

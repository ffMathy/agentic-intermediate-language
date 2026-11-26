import type { CSSProperties } from "react";
import { specProjects } from "../../spec";
import { Stack } from "../../parts/stack";
import { PullRequestDiff } from "./pull-request-diff";

const GEN_PATHS: string[] = [
  "examples/tictactoe/src/gen/app/demo/watch-a-demo.tsx",
  "examples/tictactoe/checks/app/demo/watch-a-demo.test.tsx",
  "examples/tictactoe/ail.lock.json",
];

const SHOT_TESTS: string[] = ["perfect play ends in a draw", "watch again"];

const windowStyle: CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  overflow: "hidden",
  boxShadow: "0 12px 32px rgba(42, 26, 14, 0.10)",
};

const headerStyle: CSSProperties = {
  padding: "var(--space-4) clamp(16px, 4vw, 24px)",
  borderBottom: "1px solid var(--color-border)",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "var(--font-lead)",
  fontWeight: 700,
  color: "var(--color-text)",
};

const metaStyle: CSSProperties = {
  margin: "var(--space-1) 0 0 0",
  fontSize: "var(--font-small)",
  color: "var(--color-text-muted)",
};

const badgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "2px var(--space-2)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-pass)",
  color: "var(--color-on-accent)",
  fontSize: "var(--font-tiny)",
  fontWeight: 700,
  marginRight: "var(--space-2)",
};

const summaryStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-2)",
  padding: "var(--space-3) clamp(16px, 4vw, 24px)",
  background: "var(--color-surface-raised)",
  borderBottom: "1px solid var(--color-border)",
};

const toreadStyle: CSSProperties = {
  padding: "var(--space-1) var(--space-3)",
  borderRadius: "var(--radius-pill)",
  fontSize: "var(--font-small)",
  fontWeight: 700,
  background: "var(--color-accent)",
  color: "var(--color-on-accent)",
};

const foldedStyle: CSSProperties = {
  padding: "var(--space-1) var(--space-3)",
  borderRadius: "var(--radius-pill)",
  fontSize: "var(--font-small)",
  fontWeight: 600,
  background: "var(--color-surface)",
  color: "var(--color-text-muted)",
  border: "1px solid var(--color-border)",
};

const fileStyle: CSSProperties = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  background: "var(--color-surface)",
  minWidth: 0,
};

const filebarStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--space-2)",
  padding: "var(--space-2) var(--space-3)",
  background: "var(--color-surface-raised)",
  borderBottom: "1px solid var(--color-border)",
};

const filebarPathStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-tiny)",
  color: "var(--color-text)",
  overflowWrap: "anywhere",
  flex: "1 1 200px",
};

const tagStyle: CSSProperties = {
  padding: "2px var(--space-2)",
  borderRadius: "var(--radius-pill)",
  fontSize: "var(--font-micro)",
  fontWeight: 700,
  letterSpacing: "0.04em",
  background: "var(--color-step-check)",
  color: "var(--color-on-accent)",
};

const shotsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
  gap: "var(--space-3)",
  padding: "var(--space-3)",
};

const shotStyle: CSSProperties = {
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
  minWidth: 0,
};

const frameStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  boxSizing: "border-box",
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
};

const captionStyle: CSSProperties = {
  fontSize: "var(--font-tiny)",
  color: "var(--color-text-muted)",
  overflowWrap: "anywhere",
};

const captionNameStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
};

const markStyle: CSSProperties = {
  color: "var(--color-pass)",
  fontWeight: 700,
};

const generatedStyle: CSSProperties = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
};

const rowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--space-2)",
  padding: "var(--space-2) var(--space-3)",
  background: "var(--color-surface-raised)",
  fontSize: "var(--font-tiny)",
};

const rowPathStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  color: "var(--color-text-muted)",
  overflowWrap: "anywhere",
  flex: "1 1 220px",
};

const rowGeneratedStyle: CSSProperties = {
  color: "var(--color-text-muted)",
};

const loadStyle: CSSProperties = {
  color: "var(--color-accent)",
  fontWeight: 600,
  textDecoration: "underline",
};

/** a pull request for one spec change to the demo, in the shape GitHub shows it: a title, a summary of the files, then the files */
export function SamplePullRequest() {
  const project = specProjects.find((p) => p.key === "tictactoe");
  const shots = SHOT_TESTS.flatMap((test) => {
    const shot = project?.shots.find((s) => s.node === "WatchADemo" && s.test === test);
    return shot ? [shot] : [];
  });
  const first = shots[0];
  const folder = first ? first.path.slice(0, first.path.lastIndexOf("/") + 1) : "";

  return (
    <div role="region" aria-label="Sample pull request" style={windowStyle}>
      <Stack dir="v" align="stretch">
        <div style={headerStyle}>
          <h3 style={titleStyle}>Let viewers watch the demo again</h3>
          <p style={metaStyle}>
            <span style={badgeStyle}>Open</span>
            wants to merge 1 commit into main · examples/tictactoe
          </p>
        </div>
        <div style={summaryStyle}>
          <span style={toreadStyle}>To review: 1 spec file, 2 screens</span>
          <span style={foldedStyle}>Collapsed: 3 files written by ail build</span>
        </div>
        <Stack dir="v" gap="space.3" align="stretch" pad="space.3">
          <PullRequestDiff />
          {first ? (
            <div style={fileStyle}>
              <div style={filebarStyle}>
                <span style={filebarPathStyle}>{"examples/tictactoe/ail/" + folder}</span>
                <span style={tagStyle}>screens</span>
              </div>
              <div style={shotsStyle}>
                {shots.map((shot) => (
                  <figure key={shot.path} style={shotStyle}>
                    <img
                      src={shot.src}
                      alt={"Screenshot at the end of the check “{test}”".replace("{test}", shot.test)}
                      style={frameStyle}
                    />
                    <figcaption style={captionStyle}>
                      <span style={captionNameStyle}>{shot.path.slice(shot.path.lastIndexOf("/") + 1)}</span>
                      <br />
                      <span style={markStyle}>✓</span>
                      {" “" + shot.test + "”"}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ) : null}
          <div style={generatedStyle}>
            <Stack dir="v" align="stretch">
              {GEN_PATHS.map((path, i) => (
                <div
                  key={path}
                  style={i === 0 ? rowStyle : { ...rowStyle, borderTop: "1px solid var(--color-border)" }}
                >
                  <span style={rowPathStyle}>{path}</span>
                  <span style={rowGeneratedStyle}>Generated files are not rendered by default.</span>
                  <span style={loadStyle}>Load diff</span>
                </div>
              ))}
            </Stack>
          </div>
        </Stack>
      </Stack>
    </div>
  );
}

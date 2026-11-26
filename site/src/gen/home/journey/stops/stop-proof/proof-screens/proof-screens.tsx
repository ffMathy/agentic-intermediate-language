import { specProjects } from "../../../../../spec";
import { Stack } from "../../../../../parts/stack/stack";

type Shot = (typeof specProjects)[number]["shots"][number];

const TESTS = ["winning", "the computer answers"];

function pickShots(): Shot[] {
  const project = specProjects.find((p) => p.key === "tictactoe");
  if (!project) {
    return [];
  }
  return TESTS.map((test) =>
    project.shots.find((s) => s.node === "PlayAGame" && s.test === test),
  ).filter((s): s is Shot => s !== undefined);
}

/** "two screenshots of the demo's play screen, taken at the end of its checks "winning" and "the computer answers", side by side when there is room, each with a check mark and the check's name under it" */
export function ProofScreens() {
  const shots = pickShots();
  return (
    <Stack dir="v" gap="space.3" align="stretch">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(128px, 100%), 1fr))",
          gap: "var(--space-3)",
          width: "100%",
        }}
      >
        {shots.map((shot) => (
          <figure
            key={shot.path}
            style={{
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            <img
              src={shot.src}
              alt={`Screenshot at the end of the check “${shot.test}”`}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                boxSizing: "border-box",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            />
            <figcaption
              style={{
                fontSize: "var(--font-tiny)",
                color: "var(--color-text-muted)",
                textAlign: "center",
              }}
            >
              <span style={{ color: "var(--color-pass)", fontWeight: 700 }}>✓</span>
              {" "}
              {`“${shot.test}”`}
            </figcaption>
          </figure>
        ))}
      </div>
      <p
        style={{
          fontSize: "var(--font-tiny)",
          color: "var(--color-text-muted)",
          margin: 0,
          textAlign: "center",
          overflowWrap: "anywhere",
        }}
      >
        Committed beside the spec, in{" "}
        <code style={{ fontFamily: "var(--font-mono)" }}>
          examples/tictactoe/ail/app/play/shots/
        </code>
      </p>
    </Stack>
  );
}

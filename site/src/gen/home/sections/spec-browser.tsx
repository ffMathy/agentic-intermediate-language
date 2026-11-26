import { useEffect, useState } from "react";
import { specProjects } from "../../spec";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { SpecEditor } from "../../parts/spec-editor";
import { SpecShot } from "../../parts/spec-shot";
import { Stack } from "../../parts/stack";
import { SpecTree } from "./spec-tree";

const languageHref =
  "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md";

/** "both example specs can be browsed the way developers read code" */
export function SpecBrowser() {
  const [project, setProject] = useState<string>("tictactoe");
  const [file, setFile] = useState<string>("tictactoe.ail.md");

  useEffect(() => {
    const open = (hash: string) => {
      if (!hash.startsWith("#spec/")) {
        return;
      }
      const rest = hash.slice("#spec/".length);
      const slash = rest.indexOf("/");
      if (slash < 0) {
        return;
      }
      const key = rest.slice(0, slash);
      const path = rest.slice(slash + 1);
      const entry = specProjects.find((p) => p.key === key);
      if (!entry) {
        return;
      }
      const known =
        entry.files.some((f) => f.path === path) ||
        entry.shots.some((s) => s.path === path);
      if (!known) {
        return;
      }
      setProject(key);
      setFile(path);
      document.getElementById("specs")?.scrollIntoView();
    };
    const onHashChange = () => {
      open(window.location.hash);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const anchor = target.closest("a");
      const href = anchor ? anchor.getAttribute("href") : null;
      if (href !== null && href.startsWith("#spec/")) {
        open(href);
      }
    };
    open(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const shown = specProjects.find((p) => p.key === project);
  const files = shown ? shown.files : [];
  const shots = shown ? shown.shots : [];
  const pickedFile = files.find((f) => f.path === file);
  const pickedShot = pickedFile ? undefined : shots.find((s) => s.path === file);

  const showProject = (key: string) => {
    if (key === project) {
      return;
    }
    const entry = specProjects.find((p) => p.key === key);
    if (!entry) {
      return;
    }
    setProject(key);
    setFile(entry.files.length > 0 ? entry.files[0].path : "");
  };

  const sizeText = "{nodes} nodes in {files} files, {shots} screenshots"
    .replace("{nodes}", String(shown ? shown.nodeCount : 0))
    .replace("{files}", String(files.length))
    .replace("{shots}", String(shots.length));

  return (
    <Section id="specs" tone="raised">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="Dogfooding"
          text="Browse the specs"
          lead="Read both example specs the way you read code: the Tic-Tac-Toe demo, and this website itself, which is written in AIL and compiled by ail build too. Every screenshot that proves a part of the spec sits in a shots/ folder beside it. The files come straight from the repository at build time, so they are always current."
        />
        <div
          style={{
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--color-code-border)",
            background: "var(--color-code)",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-1) var(--space-3)",
              background: "var(--color-code-bar)",
              borderBottom: "1px solid var(--color-code-border)",
            }}
          >
            <div aria-hidden="true" style={{ display: "flex", gap: "6px" }}>
              <span
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-dot-red)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-dot-amber)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-dot-green)",
                }}
              />
            </div>
            <div
              role="group"
              aria-label="Projects"
              style={{ display: "flex", gap: "var(--space-1)" }}
            >
              {specProjects.map((p) => {
                const picked = p.key === project;
                return (
                  <button
                    key={p.key}
                    type="button"
                    aria-pressed={picked}
                    onClick={() => showProject(p.key)}
                    style={{
                      fontSize: "var(--font-small)",
                      fontWeight: 600,
                      minHeight: "44px",
                      padding: "var(--space-1) var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: picked ? "var(--color-code-pick)" : "transparent",
                      color: picked ? "var(--color-code-text)" : "var(--color-code-muted)",
                      cursor: "pointer",
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
            <p
              className="ail-wide"
              style={{
                margin: "0 0 0 auto",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--font-tiny)",
                color: "var(--color-code-muted)",
              }}
            >
              {sizeText}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <SpecTree
              files={files.map((f) => f.path)}
              shots={shots.map((s) => s.path)}
              picked={file}
              onPick={(path: string) => setFile(path)}
            />
            <div
              style={{
                flex: "999 1 420px",
                minWidth: 0,
                maxWidth: "100%",
                overflow: "hidden",
                height: "clamp(380px, 120vw, 560px)",
              }}
            >
              {pickedFile ? (
                <SpecEditor
                  text={pickedFile.text}
                  path={project + "/" + file}
                  label={"Source of {path}".replace("{path}", file)}
                />
              ) : pickedShot ? (
                <SpecShot
                  node={pickedShot.node}
                  test={pickedShot.test}
                  path={pickedShot.path}
                  src={pickedShot.src}
                />
              ) : null}
            </div>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "var(--font-body)",
            lineHeight: 1.6,
            color: "var(--color-text-muted)",
            maxWidth: "var(--width-prose)",
          }}
        >
          {"Every section, the notation for types and values, and the rules ail build enforces are in "}
          <a
            href={languageHref}
            style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            the language definition
          </a>
          {". A spec never uses a programming language's syntax: each compiler translates it into its target's own conventions."}
        </p>
      </Stack>
    </Section>
  );
}

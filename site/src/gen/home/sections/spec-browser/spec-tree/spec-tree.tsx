import { useEffect, useRef } from "react";
import type { ChangeEvent, ReactNode } from "react";

type SpecTreeProps = {
  files: string[];
  shots: string[];
  picked: string;
  onPick: (path: string) => void;
};

function compareEntries(a: string, b: string): number {
  const pa = a.split("/");
  const pb = b.split("/");
  for (let i = 0; i < pa.length && i < pb.length; i++) {
    const aFile = i === pa.length - 1;
    const bFile = i === pb.length - 1;
    if (aFile && !bFile) return -1;
    if (bFile && !aFile) return 1;
    if (pa[i] === pb[i]) {
      if (aFile) return 0;
      continue;
    }
    if (!aFile) {
      if (pa[i] === "shots") return -1;
      if (pb[i] === "shots") return 1;
    }
    return pa[i] < pb[i] ? -1 : 1;
  }
  return 0;
}

function folderOf(path: string): string {
  const at = path.lastIndexOf("/");
  return at < 0 ? "" : path.slice(0, at);
}

function slashes(path: string): number {
  return path.split("/").length - 1;
}

/** "the spec files and the screenshots together, grouped by folder, the picked one marked" */
export function SpecTree({ files, shots, picked, onPick }: SpecTreeProps) {
  const navRef = useRef<HTMLElement>(null);
  const pickedRef = useRef<HTMLButtonElement>(null);
  const shotSet = new Set(shots);
  const entries = [...files, ...shots].sort(compareEntries);

  useEffect(() => {
    const nav = navRef.current;
    const el = pickedRef.current;
    if (!nav || !el) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.top < navRect.top) {
      nav.scrollTop += elRect.top - navRect.top;
    } else if (elRect.bottom > navRect.bottom) {
      nav.scrollTop += elRect.bottom - navRect.bottom;
    }
  }, [picked]);

  const rows: ReactNode[] = [];
  let previous = "";
  for (const path of entries) {
    const folder = folderOf(path);
    if (folder !== previous && folder !== "") {
      rows.push(
        <div
          key={`folder:${folder}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-tiny)",
            color: "var(--color-code-muted)",
            padding: "var(--space-1) var(--space-3)",
            paddingLeft: `calc(var(--space-3) + ${12 * slashes(folder)}px)`,
          }}
        >
          {`${folder}/`}
        </div>,
      );
    }
    previous = folder;
    const isPicked = path === picked;
    rows.push(
      <button
        key={`file:${path}`}
        type="button"
        ref={isPicked ? pickedRef : undefined}
        aria-label={path}
        title={path}
        aria-pressed={isPicked}
        onClick={() => onPick(path)}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-tiny)",
          color: "var(--color-code-text)",
          background: isPicked ? "var(--color-code-pick)" : "transparent",
          borderTop: "none",
          borderRight: "none",
          borderBottom: "none",
          borderLeft: isPicked
            ? "2px solid var(--color-accent)"
            : "2px solid transparent",
          padding: "var(--space-1) var(--space-3)",
          paddingLeft: `calc(var(--space-3) + ${12 * slashes(path)}px)`,
          cursor: "pointer",
        }}
      >
        {shotSet.has(path) ? (
          <span aria-hidden="true" style={{ color: "var(--color-thread)" }}>
            {"▣ "}
          </span>
        ) : null}
        {path.slice(path.lastIndexOf("/") + 1)}
      </button>,
    );
  }

  const options: ReactNode[] = [];
  let group: { folder: string; paths: string[] } | null = null;
  const flush = () => {
    if (group) {
      options.push(
        <optgroup key={`group:${group.folder}`} label={`${group.folder}/`}>
          {group.paths.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </optgroup>,
      );
      group = null;
    }
  };
  for (const path of entries) {
    const folder = folderOf(path);
    if (folder === "") {
      flush();
      options.push(
        <option key={path} value={path}>
          {path}
        </option>,
      );
    } else if (group && group.folder === folder) {
      group.paths.push(path);
    } else {
      flush();
      group = { folder, paths: [path] };
    }
  }
  flush();

  return (
    <>
      <select
        className="ail-narrow"
        aria-label="Spec files"
        value={picked}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          onPick(e.target.value)
        }
        style={{
          width: "100%",
          minHeight: "44px",
          boxSizing: "border-box",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-small)",
          color: "var(--color-code-text)",
          background: "var(--color-code-side)",
          borderTop: "none",
          borderRight: "none",
          borderLeft: "none",
          borderBottom: "1px solid var(--color-code-border)",
          padding: "var(--space-2) var(--space-3)",
        }}
      >
        {options}
      </select>
      <nav
        ref={navRef}
        className="ail-wide"
        aria-label="Spec files"
        style={{
          flex: "1 1 220px",
          maxHeight: "clamp(200px, 40vw, 560px)",
          overflowY: "auto",
          background: "var(--color-code-side)",
          padding: "var(--space-2) 0",
          boxSizing: "border-box",
        }}
      >
        {rows}
      </nav>
    </>
  );
}

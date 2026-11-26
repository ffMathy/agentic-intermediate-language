import { Fragment, useEffect, useRef } from "react";
import type { ChangeEvent, CSSProperties } from "react";

type SpecTreeProps = {
  files: string[];
  shots: string[];
  picked: string;
  onPick: (path: string) => void;
};

type Group = {
  folder: string;
  paths: string[];
};

function compareNames(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function compareEntries(a: string, b: string): number {
  const pa = a.split("/");
  const pb = b.split("/");
  const n = Math.min(pa.length, pb.length);
  for (let i = 0; i < n; i++) {
    const lastA = i === pa.length - 1;
    const lastB = i === pb.length - 1;
    if (lastA !== lastB) {
      return lastA ? -1 : 1;
    }
    if (pa[i] === pb[i]) {
      if (lastA) {
        return 0;
      }
      continue;
    }
    if (lastA) {
      return compareNames(pa[i], pb[i]);
    }
    if (pa[i] === "shots") {
      return -1;
    }
    if (pb[i] === "shots") {
      return 1;
    }
    return compareNames(pa[i], pb[i]);
  }
  return 0;
}

function folderOf(path: string): string {
  const at = path.lastIndexOf("/");
  return at < 0 ? "" : path.slice(0, at);
}

function nameOf(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

function slashes(path: string): number {
  return path.split("/").length - 1;
}

const explorerStyle: CSSProperties = {
  flex: "1 1 220px",
  maxHeight: "clamp(200px, 40vw, 560px)",
  overflowY: "auto",
  background: "var(--color-code-side)",
  padding: "var(--space-2) 0",
  boxSizing: "border-box",
};

const pickerStyle: CSSProperties = {
  width: "100%",
  minHeight: "44px",
  boxSizing: "border-box",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--font-small)",
  color: "var(--color-code-text)",
  background: "var(--color-code-side)",
  border: "none",
  borderBottom: "1px solid var(--color-code-border)",
  padding: "var(--space-2) var(--space-3)",
};

function folderStyle(folder: string): CSSProperties {
  const depth = slashes(folder) + 1;
  return {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--font-tiny)",
    color: "var(--color-code-muted)",
    padding: `var(--space-1) var(--space-3) var(--space-1) calc(var(--space-3) + ${12 * (depth - 1)}px)`,
  };
}

function fileStyle(path: string, isPicked: boolean): CSSProperties {
  const depth = slashes(path);
  return {
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
    padding: `var(--space-1) var(--space-3) var(--space-1) calc(var(--space-3) + ${12 * depth}px)`,
    cursor: "pointer",
  };
}

const markStyle: CSSProperties = {
  color: "var(--color-thread)",
};

/** "the spec files and the screenshots together, grouped by folder, the picked one marked" */
export function SpecTree({ files, shots, picked, onPick }: SpecTreeProps) {
  const explorerRef = useRef<HTMLElement>(null);
  const shotSet = new Set(shots);
  const entries = [...files, ...shots].sort(compareEntries);

  const groups: Group[] = [];
  for (const path of entries) {
    const folder = folderOf(path);
    const last = groups[groups.length - 1];
    if (last !== undefined && last.folder === folder) {
      last.paths.push(path);
    } else {
      groups.push({ folder, paths: [path] });
    }
  }

  useEffect(() => {
    const explorer = explorerRef.current;
    if (explorer === null) {
      return;
    }
    const entry = Array.from(explorer.querySelectorAll("button")).find(
      (button) => button.title === picked,
    );
    if (entry === undefined) {
      return;
    }
    const box = explorer.getBoundingClientRect();
    const rect = entry.getBoundingClientRect();
    if (rect.top < box.top) {
      explorer.scrollTop += rect.top - box.top;
    } else if (rect.bottom > box.bottom) {
      explorer.scrollTop += rect.bottom - box.bottom;
    }
  }, [picked]);

  return (
    <>
      <select
        className="ail-narrow"
        aria-label="Spec files"
        style={pickerStyle}
        value={picked}
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
          onPick(event.target.value)
        }
      >
        {groups.map((group, index) =>
          group.folder === "" ? (
            <Fragment key={index}>
              {group.paths.map((path) => (
                <option key={path} value={path}>
                  {path}
                </option>
              ))}
            </Fragment>
          ) : (
            <optgroup key={index} label={`${group.folder}/`}>
              {group.paths.map((path) => (
                <option key={path} value={path}>
                  {path}
                </option>
              ))}
            </optgroup>
          ),
        )}
      </select>
      <nav
        ref={explorerRef}
        className="ail-wide"
        aria-label="Spec files"
        style={explorerStyle}
      >
        {groups.map((group, index) => (
          <Fragment key={index}>
            {group.folder === "" ? null : (
              <div style={folderStyle(group.folder)}>{`${group.folder}/`}</div>
            )}
            {group.paths.map((path) => (
              <button
                key={path}
                type="button"
                aria-label={path}
                title={path}
                aria-pressed={path === picked}
                style={fileStyle(path, path === picked)}
                onClick={() => onPick(path)}
              >
                {shotSet.has(path) ? (
                  <span aria-hidden="true" style={markStyle}>
                    {"▣ "}
                  </span>
                ) : null}
                {nameOf(path)}
              </button>
            ))}
          </Fragment>
        ))}
      </nav>
    </>
  );
}

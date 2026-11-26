import { useEffect, useRef } from "react";
import type { ChangeEvent, ReactElement } from "react";

export type SpecTreeProps = {
  files: string[];
  shots: string[];
  picked: string;
  onPick: (path: string) => void;
};

type Group = {
  folder: string;
  paths: string[];
};

const compareNames = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

const comparePaths = (a: string, b: string): number => {
  const pa = a.split("/");
  const pb = b.split("/");
  const n = Math.min(pa.length, pb.length);
  for (let i = 0; i < n; i += 1) {
    if (pa[i] === pb[i]) {
      continue;
    }
    const aDirect = i === pa.length - 1;
    const bDirect = i === pb.length - 1;
    if (aDirect && !bDirect) {
      return -1;
    }
    if (!aDirect && bDirect) {
      return 1;
    }
    if (!aDirect && !bDirect) {
      if (pa[i] === "shots") {
        return -1;
      }
      if (pb[i] === "shots") {
        return 1;
      }
    }
    return compareNames(pa[i], pb[i]);
  }
  return pa.length - pb.length;
};

const folderOf = (path: string): string => {
  const i = path.lastIndexOf("/");
  return i < 0 ? "" : path.slice(0, i);
};

const nameOf = (path: string): string => path.slice(path.lastIndexOf("/") + 1);

const slashes = (path: string): number => path.split("/").length - 1;

const groupsOf = (paths: string[]): Group[] => {
  const groups: Group[] = [];
  for (const path of paths) {
    const folder = folderOf(path);
    const last = groups[groups.length - 1];
    if (last !== undefined && last.folder === folder) {
      last.paths.push(path);
    } else {
      groups.push({ folder, paths: [path] });
    }
  }
  return groups;
};

/** "the spec files and the screenshots together, grouped by folder, the picked one marked" */
export function SpecTree({ files, shots, picked, onPick }: SpecTreeProps): ReactElement {
  const navRef = useRef<HTMLElement | null>(null);
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const shotSet = new Set(shots);
  const entries = [...files, ...shots].sort(comparePaths);
  const groups = groupsOf(entries);

  useEffect(() => {
    const nav = navRef.current;
    const el = buttonsRef.current.get(picked);
    if (nav === null || el === undefined) {
      return;
    }
    const n = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top < n.top) {
      nav.scrollTop += r.top - n.top;
    } else if (r.bottom > n.bottom) {
      nav.scrollTop += r.bottom - n.bottom;
    }
  }, [picked]);

  const onChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onPick(e.target.value);
  };

  return (
    <>
      <select
        className="ail-narrow"
        aria-label="Spec files"
        value={picked}
        onChange={onChange}
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
        {groups.map((group, gi) =>
          group.folder === "" ? (
            group.paths.map((path) => (
              <option key={path} value={path}>
                {path}
              </option>
            ))
          ) : (
            <optgroup key={`${gi}:${group.folder}`} label={`${group.folder}/`}>
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
        {groups.map((group, gi) => (
          <div key={`${gi}:${group.folder}`}>
            {group.folder === "" ? null : (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--font-tiny)",
                  color: "var(--color-code-muted)",
                  padding: `var(--space-1) var(--space-3) var(--space-1) calc(var(--space-3) + ${12 * slashes(group.folder)}px)`,
                }}
              >
                {`${group.folder}/`}
              </div>
            )}
            {group.paths.map((path) => {
              const isPicked = path === picked;
              return (
                <button
                  key={path}
                  type="button"
                  ref={(el) => {
                    if (el === null) {
                      buttonsRef.current.delete(path);
                    } else {
                      buttonsRef.current.set(path, el);
                    }
                  }}
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
                    padding: `var(--space-1) var(--space-3) var(--space-1) calc(var(--space-3) + ${12 * slashes(path)}px)`,
                    cursor: "pointer",
                  }}
                >
                  {shotSet.has(path) ? (
                    <span aria-hidden="true" style={{ color: "var(--color-thread)" }}>
                      {"▣ "}
                    </span>
                  ) : null}
                  {nameOf(path)}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}

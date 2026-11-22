import { useEffect, useRef, useState } from "react";
import { chapterStart, clock, linesShown, totalSeconds } from "./walkthrough/walkthrough";
import { BUILD } from "./walkthrough/build-walkthrough";
import { ADOPT } from "./walkthrough/adopt-walkthrough";
import { WalkTitleBar } from "./walk-title-bar";
import { WalkTerminal } from "./walk-terminal";
import { WalkPicture } from "./walk-picture";
import { WalkCaption } from "./walk-caption";
import { WalkControls } from "./walk-controls";
import { WalkTimeline } from "./walk-timeline";

type Tab = "build" | "adopt";

/** a dark player window with two walkthroughs as tabs, "ail build" and "ail adopt"; "ail build" is shown first */
export function WalkthroughPlayer() {
  const [tab, setTab] = useState<Tab>("build");
  const [chapter, setChapter] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);

  const w = tab === "build" ? BUILD : ADOPT;
  const beat = w.beats[chapter];
  const last = w.beats.length - 1;
  const beatMs = beat.seconds * 1000;
  const complete = !playing && elapsed === 0;
  const ended = !playing && chapter === last && elapsed === beatMs;

  const pos = useRef({ chapter, elapsed });
  pos.current = { chapter, elapsed };

  useEffect(() => {
    if (!playing) {
      return;
    }
    const id = setInterval(() => {
      const p = pos.current;
      const end = w.beats[p.chapter].seconds * 1000;
      const next = p.elapsed + 100;
      if (next >= end) {
        if (p.chapter !== last) {
          pos.current = { chapter: p.chapter + 1, elapsed: 0 };
          setChapter(p.chapter + 1);
          setElapsed(0);
        } else {
          pos.current = { chapter: p.chapter, elapsed: end };
          setElapsed(end);
          setPlaying(false);
        }
      } else {
        pos.current = { chapter: p.chapter, elapsed: next };
        setElapsed(next);
      }
    }, 100);
    return () => clearInterval(id);
  }, [playing, w, last]);

  const go = (k: number) => {
    setChapter(Math.min(Math.max(k, 0), last));
    setElapsed(0);
    setStarted(true);
  };

  const total = clock(totalSeconds(w));
  const now = complete
    ? clock(chapterStart(w, chapter) + beat.seconds)
    : clock(chapterStart(w, chapter) + Math.floor(elapsed / 1000));

  const onPick = (t: Tab) => {
    if (t === tab) {
      return;
    }
    setTab(t);
    setChapter(0);
    setElapsed(0);
    setPlaying(false);
    setStarted(false);
  };

  const onPlay = () => {
    setStarted(true);
    if (playing) {
      setPlaying(false);
    } else if (ended) {
      setChapter(0);
      setElapsed(0);
      setPlaying(true);
    } else {
      setPlaying(true);
    }
  };

  const onBig = () => {
    setPlaying(true);
    setStarted(true);
    document.getElementById("walk-play")?.focus();
  };

  const mode = playing ? "pause" : ended ? "replay" : "play";
  const lines = playing
    ? beat.lines.slice(0, linesShown(beat.lines.length, beat.seconds, elapsed))
    : beat.lines;
  const played = complete ? 1 : elapsed / beatMs;

  return (
    <div
      role="region"
      aria-label="Walkthrough player"
      style={{
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--color-code-border)",
        background: "var(--color-code)",
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.18)",
      }}
    >
      <WalkTitleBar tab={tab} now={now} total={total} onPick={onPick} />
      <div role="tabpanel" id="walk-panel" aria-labelledby={`walk-tab-${tab}`}>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            overflow: "hidden",
            borderBottom: "1px solid var(--color-code-border)",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 320px", minWidth: 0 }}>
            <WalkTerminal place={w.place} lines={lines} caret={playing} />
            {!started && (
              <button
                type="button"
                onClick={onBig}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  maxWidth: "90%",
                  padding: "var(--space-3) var(--space-6)",
                  borderRadius: "var(--radius-pill)",
                  border: "none",
                  background: "var(--color-accent)",
                  color: "var(--color-on-accent)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--font-lead)",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  textAlign: "center",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                  cursor: "pointer",
                }}
              >
                {`Play the walkthrough (${total})`}
              </button>
            )}
          </div>
          <div
            style={{
              flex: "1.4 1 400px",
              minWidth: 0,
              boxShadow: "-1px 0 0 var(--color-code-border), 0 -1px 0 var(--color-code-border)",
            }}
          >
            <WalkPicture walkthrough={w} chapter={chapter} />
          </div>
        </div>
        <WalkCaption
          n={chapter + 1}
          count={w.beats.length}
          branch={beat.branch}
          title={beat.title}
          caption={beat.caption}
        />
        <WalkControls
          mode={mode}
          first={chapter === 0}
          last={chapter === last}
          onPrevious={() => go(chapter - 1)}
          onPlay={onPlay}
          onNext={() => go(chapter + 1)}
        />
        <div style={{ padding: "0 var(--space-4) var(--space-4)" }}>
          <WalkTimeline beats={w.beats} chapter={chapter} played={played} onPick={(k: number) => go(k)} />
        </div>
      </div>
    </div>
  );
}

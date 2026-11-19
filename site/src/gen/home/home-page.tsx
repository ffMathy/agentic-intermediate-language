import { TopBar } from "./sections/top-bar";
import { Hero } from "./hero/hero";
import { GapStrip } from "./sections/gap-strip";
import { Journey } from "./journey/journey";
import { Readers } from "./readers/readers";
import { BuildLoop } from "./build-loop/build-loop";
import { GetStarted } from "./sections/get-started";
import { Footer } from "./sections/footer";

/** "the parts appear in this order: TopBar, Hero, GapStrip, Journey, Readers, BuildLoop, GetStarted, Footer" */
export function HomePage() {
  return (
    <div
      style={{
        background: "var(--color-page)",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--font-body)",
        lineHeight: 1.6,
        minHeight: "100vh",
      }}
    >
      <TopBar />
      <main>
        <Hero />
        <GapStrip />
        <Journey />
        <Readers />
        <BuildLoop />
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
}

import { Stack } from "../catalog";
import { Hero } from "./sections/hero";
import { Steps } from "./sections/steps";
import { SpecSample } from "./sections/spec-sample";
import { GetStarted } from "./sections/get-started";
import { Commands } from "./sections/commands";
import { Footer } from "./sections/footer";

/** HomePage: the sections appear in this order: Hero, Steps, SpecSample, GetStarted, Commands, Footer. */
export function HomePage() {
  return (
    <div style={{ maxWidth: "880px", marginLeft: "auto", marginRight: "auto" }}>
      <Stack dir="v" gap="space.12" align="stretch" pad="space.6">
        <Hero />
        <Steps />
        <SpecSample />
        <GetStarted />
        <Commands />
        <Footer />
      </Stack>
    </div>
  );
}

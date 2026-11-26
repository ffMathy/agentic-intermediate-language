import { Section } from "../../parts/section/section";
import { SectionHeading } from "../../parts/section-heading/section-heading";
import { Stack } from "../../parts/stack/stack";
import { SamplePullRequest } from "./sample-pull-request/sample-pull-request";

/** a heading, a sample pull request, and a note on why it reads that way */
export function ReviewSection() {
  return (
    <Section id="review" tone="plain">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="REVIEWING A CHANGE"
          text="Review the spec and the screens. That's all."
          lead="When the spec changes, ail build writes the code, the checks and the lock, and retakes every screen the change touched. In the pull request, what the build wrote is committed but collapsed. What is left to read is what the spec now says, and what the app now looks like, side by side in the same folder."
        />
        <SamplePullRequest />
        <p
          style={{
            fontSize: "var(--font-small)",
            lineHeight: 1.6,
            color: "var(--color-text-muted)",
            maxWidth: "var(--width-prose)",
            margin: 0,
          }}
        >
          This is how pull requests in this repository read: .gitattributes marks what ail build writes as generated, so GitHub collapses it, and ail show checks puts every test, with the screen it ends on, into the description. The code is still there, one click away, and the checks have already proven it does what the spec says.
        </p>
      </Stack>
    </Section>
  );
}

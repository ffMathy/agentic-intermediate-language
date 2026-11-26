// Used by scripts/review.sh: keep this project's checks section in a pull
// request's description up to date, leaving the rest of it as it is.
// Several projects' jobs write the same description at once, so after writing
// it reads the description back and tries again if another job's write lost
// this section.
//   bun scripts/pr-body.ts <owner/repo> <pr> <project> <checks.md>
import { readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { hasSection, sectionFor, upsertSection } from "../src/report.ts";

const [repo, pr, project, file] = process.argv.slice(2);
if (!repo || !pr || !project || !file) throw new Error("usage: bun scripts/pr-body.ts <owner/repo> <pr> <project> <checks.md>");
const section = sectionFor(project, readFileSync(file, "utf8"));

const gh = (...args: string[]) => {
  const r = Bun.spawnSync(["gh", "api", ...args], { stdout: "pipe", stderr: "pipe" });
  if (r.exitCode !== 0) throw new Error(r.stderr.toString().trim());
  return r.stdout.toString();
};
const read = () => (JSON.parse(gh(`repos/${repo}/pulls/${pr}`)).body as string | null) ?? "";

for (let attempt = 1; ; attempt++) {
  const body = read();
  if (hasSection(body, project, section)) break;
  const out = join(tmpdir(), `ail-pr-body-${process.pid}.md`);
  writeFileSync(out, upsertSection(body, project, section));
  gh("-X", "PATCH", `repos/${repo}/pulls/${pr}`, "-F", `body=@${out}`);
  await Bun.sleep(1000 + Math.random() * 2000 * attempt);
  if (hasSection(read(), project, section)) break;
  if (attempt === 5) throw new Error("another job kept overwriting the description");
}

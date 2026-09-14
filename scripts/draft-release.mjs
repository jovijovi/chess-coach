import { readFile, writeFile, appendFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { releaseNotes } from "./lib/release-notes.mjs";
const tag = process.argv[2];
if (!/^v0\.2\.0(?:-rc\.[1-9]\d*)?$/.test(tag ?? ""))
  throw new Error("Invalid release tag");
const root = "output/release";
const sources = JSON.parse(await readFile(`${root}/sources.json`, "utf8"));
if (
  `v${sources.version}` !== tag ||
  sources.dirty ||
  sources.sourceCommit !== process.env.GITHUB_SHA
)
  throw new Error("Release provenance mismatch");
const files = [
  `${root}/chess-coach-${sources.version}.tar.gz`,
  `${root}/sources.json`,
  `${root}/SHA256SUMS`,
];
for (const target of ["linux-x64", "darwin-x64", "darwin-arm64"]) {
  const name = `acceptance-${target}.json`;
  const bytes = await readFile(`${root}/${name}`);
  const report = JSON.parse(bytes);
  if (
    !report.passed ||
    !report.offline ||
    report.buildId !== sources.buildId ||
    report.sourceCommit !== sources.sourceCommit
  )
    throw new Error(`Acceptance failed: ${target}`);
  await appendFile(
    `${root}/SHA256SUMS`,
    `${createHash("sha256").update(bytes).digest("hex")}  ${name}\n`,
  );
  files.push(`${root}/${name}`);
}
await writeFile(
  "output/release-notes.md",
  releaseNotes(sources, { draft: true }),
);
execFileSync(
  "gh",
  [
    "release",
    "create",
    tag,
    ...files,
    "--verify-tag",
    "--draft",
    ...(tag.includes("-rc.") ? ["--prerelease"] : []),
    "--title",
    `Chess Coach ${sources.version}`,
    "--notes-file",
    "output/release-notes.md",
  ],
  { stdio: "inherit" },
);

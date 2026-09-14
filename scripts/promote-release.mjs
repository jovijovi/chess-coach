import { execFileSync } from "node:child_process";
import { readFile, mkdir, writeFile, cp, mkdtemp } from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { releaseNotes } from "./lib/release-notes.mjs";
const tag = process.argv[2];
const gh = (args) => execFileSync("gh", args, { encoding: "utf8" }).trim();
const git = (args, options = {}) =>
  execFileSync(
    "git",
    [
      "-c",
      "credential.helper=",
      "-c",
      "credential.helper=!gh auth git-credential",
      ...args,
    ],
    { encoding: "utf8", ...options },
  ).trim();
await mkdir("output", { recursive: true });
execFileSync(process.execPath, ["scripts/release-metadata.mjs", tag], {
  stdio: "inherit",
});
const metadata = JSON.parse(
  await readFile("output/release-identity.json", "utf8"),
);
const repo = process.env.GITHUB_REPOSITORY;
if (!repo || process.env.GITHUB_REF !== "refs/heads/main")
  throw new Error("Promote releases through the main-branch manual workflow");
const visibility = JSON.parse(gh(["api", `repos/${repo}`])).visibility;
if (metadata.channel === "marketplace" && visibility !== "public")
  throw new Error(
    "Stable promotion requires the owner's prior repository-publication decision",
  );
const release = JSON.parse(
  gh([
    "release",
    "view",
    tag,
    "--repo",
    repo,
    "--json",
    "isDraft,isPrerelease",
  ]),
);
if (!release.isDraft)
  throw new Error(
    "This release has already been published; immutable references will not be overwritten",
  );
const directory = await mkdtemp(join(tmpdir(), "chess-promotion-"));
gh(["release", "download", tag, "--repo", repo, "--dir", directory]);
for (const line of (await readFile(join(directory, "SHA256SUMS"), "utf8"))
  .trim()
  .split("\n")) {
  const match = /^([a-f0-9]{64})  ([a-zA-Z0-9._-]+)$/.exec(line);
  if (!match) throw new Error("Invalid checksum entry");
  const actual = createHash("sha256")
    .update(await readFile(join(directory, match[2])))
    .digest("hex");
  if (actual !== match[1])
    throw new Error(`Release checksum mismatch: ${match[2]}`);
}
const sources = JSON.parse(
  await readFile(join(directory, "sources.json"), "utf8"),
);
const notesPath = join(directory, "published-notes.md");
await writeFile(notesPath, releaseNotes(sources));
if (
  sources.version !== metadata.version ||
  sources.sourceCommit !== metadata.sourceCommit ||
  sources.dirty
)
  throw new Error("Release provenance does not match its annotated source tag");
for (const target of ["linux-x64", "darwin-x64", "darwin-arm64"]) {
  const report = JSON.parse(
    await readFile(join(directory, `acceptance-${target}.json`), "utf8"),
  );
  if (
    !report.passed ||
    report.rounds < 10 ||
    report.toolCount !== 8 ||
    !report.offline ||
    report.buildId !== sources.buildId ||
    report.sourceCommit !== sources.sourceCommit
  )
    throw new Error(`Missing or mismatched native acceptance: ${target}`);
}
const tree = join(directory, "tree");
await mkdir(tree);
execFileSync("tar", [
  "-xzf",
  join(directory, `chess-coach-${metadata.version}.tar.gz`),
  "-C",
  tree,
]);
const manifest = JSON.parse(
  await readFile(join(tree, ".agents/plugins/marketplace.json"), "utf8"),
);
if (
  manifest.name !==
  (metadata.channel === "marketplace" ? "chess-coach" : "chess-coach-preview")
)
  throw new Error("Wrong marketplace channel");
const env = {
  ...process.env,
  GIT_AUTHOR_NAME: metadata.name,
  GIT_AUTHOR_EMAIL: metadata.email,
  GIT_COMMITTER_NAME: metadata.name,
  GIT_COMMITTER_EMAIL: metadata.email,
};
const inTree = (args) => git(args, { cwd: tree, env });
inTree(["init"]);
inTree(["add", "."]);
const treeId = inTree(["write-tree"]);
const remote = `https://github.com/${repo}.git`;
const refs = git([
  "ls-remote",
  "origin",
  `refs/heads/${metadata.channel}`,
  `refs/tags/${metadata.immutableRef}`,
]);
if (refs.includes(`refs/tags/${metadata.immutableRef}`)) {
  inTree(["fetch", remote, `refs/tags/${metadata.immutableRef}`]);
  const existing = inTree(["rev-parse", "FETCH_HEAD^{commit}"]);
  if (
    inTree(["rev-parse", `${existing}^{tree}`]) !== treeId ||
    !refs.includes(`${existing}\trefs/heads/${metadata.channel}`)
  )
    throw new Error(
      "The immutable reference or channel does not match this draft; neither will be overwritten",
    );
  gh([
    "release",
    "edit",
    tag,
    "--repo",
    repo,
    "--draft=false",
    "--notes-file",
    notesPath,
    ...(metadata.channel === "marketplace-preview"
      ? ["--prerelease"]
      : ["--latest"]),
  ]);
  console.log(
    `Finished publishing ${tag}; existing immutable files were retained.`,
  );
  process.exit(0);
}
let parent;
const channelRef = refs
  .split("\n")
  .find((line) => line.endsWith(`refs/heads/${metadata.channel}`));
if (channelRef) {
  parent = channelRef.split("\t")[0];
  inTree(["fetch", remote, metadata.channel]);
  const previous = JSON.parse(
    inTree(["show", `${parent}:plugins/chess-coach/sources.json`]),
  );
  const parse = (v) => {
    const [core, rc] = v.split("-rc.");
    return [...core.split(".").map(Number), rc ? Number(rc) : Infinity];
  };
  const a = parse(metadata.version),
    b = parse(previous.version);
  const difference = a.findIndex((part, i) => part !== b[i]);
  if (difference < 0 || a[difference] < b[difference])
    throw new Error(
      "Channels only advance; use immutable refs for manual rollback",
    );
}
const commit = inTree([
  "commit-tree",
  treeId,
  ...(parent ? ["-p", parent] : []),
  "-m",
  `Publish Chess Coach ${metadata.version}\n\nSource: ${metadata.sourceCommit}`,
]);
inTree(["update-ref", `refs/heads/${metadata.channel}`, commit]);
inTree([
  "tag",
  "-a",
  metadata.immutableRef,
  commit,
  "-m",
  `Chess Coach ${metadata.version}; source ${metadata.sourceCommit}`,
]);
inTree([
  "-c",
  "credential.helper=",
  "-c",
  "credential.helper=!gh auth git-credential",
  "push",
  "--atomic",
  remote,
  `refs/heads/${metadata.channel}`,
  `refs/tags/${metadata.immutableRef}`,
]);
gh([
  "release",
  "edit",
  tag,
  "--repo",
  repo,
  "--draft=false",
  "--notes-file",
  notesPath,
  ...(metadata.channel === "marketplace-preview"
    ? ["--prerelease"]
    : ["--latest"]),
]);
console.log(
  `Published ${tag} to ${metadata.channel}; immutable ref ${metadata.immutableRef}`,
);

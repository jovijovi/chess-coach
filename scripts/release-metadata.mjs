import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
const tag = process.argv[2];
if (!/^v0\.2\.0(?:-rc\.[1-9]\d*)?$/.test(tag ?? ""))
  throw new Error("Expected v0.2.0 or v0.2.0-rc.N");
const git = (args) => execFileSync("git", args, { encoding: "utf8" }).trim();
if (git(["cat-file", "-t", `refs/tags/${tag}`]) !== "tag")
  throw new Error("Release tags must be annotated");
const version = JSON.parse(await readFile("package.json", "utf8")).version;
if (tag !== `v${version}`) throw new Error("Tag and package version differ");
const [name, email] = git([
  "for-each-ref",
  "--format=%(taggername)%00%(taggeremail:trim)",
  `refs/tags/${tag}`,
]).split("\0");
if (!name || !email || /[\r\n]/.test(name + email))
  throw new Error("The annotated tag must identify its publisher");
const metadata = {
  tag,
  version,
  name,
  email,
  sourceCommit: git(["rev-parse", `${tag}^{commit}`]),
  channel: tag.includes("-rc.") ? "marketplace-preview" : "marketplace",
  immutableRef: `plugin-${tag}`,
};
if (git(["rev-parse", "HEAD"]) !== metadata.sourceCommit)
  throw new Error("Checkout does not match release tag");
await writeFile(
  "output/release-identity.json",
  JSON.stringify(metadata, null, 2) + "\n",
);
console.log(JSON.stringify(metadata));

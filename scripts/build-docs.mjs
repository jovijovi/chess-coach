import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import en from "../docs/locales/en.mjs";
import zh from "../docs/locales/zh-CN.mjs";
import { renderPage } from "../docs/template.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = join(root, "output/docs");
const metadata = JSON.parse(await readFile(join(root, "package.json"), "utf8"));

function keys(value, path = "") {
  if (value === null || typeof value !== "object") return [path];
  return Object.entries(value).flatMap(([key, child]) =>
    keys(child, `${path}.${key}`),
  );
}
if (JSON.stringify(keys(en)) !== JSON.stringify(keys(zh))) {
  throw new Error(
    "Documentation locales must have matching keys and structure.",
  );
}
if (
  en.sections.some((section, index) => section.id !== zh.sections[index].id)
) {
  throw new Error("Documentation locales must use the same section anchors.");
}
await rm(destination, { recursive: true, force: true });
await mkdir(join(destination, "assets"), { recursive: true });
await mkdir(join(destination, "zh-CN"), { recursive: true });
for (const locale of [en, zh]) {
  const page = locale.lang === "en" ? "index.html" : "zh-CN/index.html";
  await writeFile(
    join(destination, page),
    renderPage(locale, metadata.version),
  );
}
for (const [source, target] of [
  ["docs/style.css", "style.css"],
  ["docs/client.js", "client.js"],
  ["plugins/chess-coach/assets/logo.svg", "logo.svg"],
  ["LICENSE", "LICENSE.txt"],
  ["NOTICE", "NOTICE.txt"],
  ["THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.md"],
  ["THIRD_PARTY_NOTICES.zh-CN.md", "THIRD_PARTY_NOTICES.zh-CN.md"],
]) {
  await cp(join(root, source), join(destination, "assets", target));
}
await writeFile(join(destination, ".nojekyll"), "");
console.log(`Built the English and Chinese documentation in ${destination}`);

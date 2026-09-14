import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  cp,
  readFile,
  writeFile,
  chmod,
  rm,
} from "node:fs/promises";
import { tmpdir, homedir } from "node:os";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";

const work = await mkdtemp(join(tmpdir(), "chess-native-"));
const anonymous = process.argv.includes("--github");
if (anonymous && process.platform !== "linux")
  throw new Error(
    "Anonymous GitHub acceptance uses the Linux disposable-profile runner.",
  );
const report = resolve(
  process.argv[2] ||
    `output/acceptance-${process.platform}-${process.arch}.json`,
);
const catalog = join(work, "marketplace 用户");
await cp("output/release/marketplace", catalog, { recursive: true });
const runner = join(work, "acceptance.mjs");
await build({
  entryPoints: ["scripts/native-acceptance.mjs"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node26",
  outfile: runner,
});
const pin = JSON.parse(await readFile("release/codex.json", "utf8"));
const target = pin[`${process.platform}-${process.arch}`];
if (!target) throw new Error("Unsupported acceptance platform");
const codex = join(work, "codex");
if (process.env.CHESS_COACH_CODEX) {
  await cp(process.env.CHESS_COACH_CODEX, codex);
} else {
  const response = await fetch(
    `https://github.com/openai/codex/releases/download/rust-v${pin.version}/codex-${target.target}.tar.gz`,
    { signal: AbortSignal.timeout(120000) },
  );
  if (!response.ok)
    throw new Error(`Codex baseline download failed: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (createHash("sha256").update(bytes).digest("hex") !== target.sha256)
    throw new Error("Codex baseline checksum mismatch");
  await writeFile(join(work, "codex.tar.gz"), bytes);
  execFileSync("tar", ["-xzf", join(work, "codex.tar.gz"), "-C", work]);
  await cp(join(work, `codex-${target.target}`), codex);
}
await chmod(codex, 0o755);
const localReport = join(work, "report.json");
const inherited = anonymous
  ? Object.fromEntries(
      Object.entries(process.env).filter(([key]) =>
        /^(HOME|USER|LOGNAME|PATH|LANG|LC_ALL|TERM|TMPDIR|SSL_CERT_FILE|SSL_CERT_DIR|NODE_EXTRA_CA_CERTS|HTTPS_PROXY|HTTP_PROXY|ALL_PROXY|NO_PROXY)$/i.test(
          key,
        ),
      ),
    )
  : process.env;
const env = {
  ...inherited,
  CHESS_COACH_CODEX: codex,
  CHESS_COACH_OFFLINE_ACCEPTANCE: "1",
};
try {
  if (process.platform === "linux") {
    const profile = join(work, "profile");
    await mkdir(profile);
    if (anonymous) {
      Object.assign(env, {
        GIT_CONFIG_NOSYSTEM: "1",
        GIT_CONFIG_GLOBAL: "/dev/null",
        GIT_TERMINAL_PROMPT: "0",
        CHESS_COACH_ANONYMOUS_ACCEPTANCE: "1",
      });
      const metadata = JSON.parse(
        await readFile(
          join(catalog, ".agents/plugins/marketplace.json"),
          "utf8",
        ),
      );
      const branch =
        metadata.name === "chess-coach" ? "marketplace" : "marketplace-preview";
      const prefix = [
        "--unshare-pid",
        "--die-with-parent",
        "--ro-bind",
        "/",
        "/",
        "--dev",
        "/dev",
        "--proc",
        "/proc",
        "--tmpfs",
        "/tmp",
        "--bind",
        work,
        work,
        "--bind",
        profile,
        homedir(),
        "--chdir",
        work,
        codex,
      ];
      for (const args of [
        [
          "plugin",
          "marketplace",
          "add",
          "jovijovi/chess-coach",
          "--ref",
          branch,
        ],
        ["plugin", "add", `chess-coach@${metadata.name}`],
        ["plugin", "marketplace", "upgrade", metadata.name],
        ["plugin", "add", `chess-coach@${metadata.name}`],
      ])
        execFileSync(
          process.env.CHESS_COACH_BWRAP || "bwrap",
          [...prefix, ...args],
          { env, stdio: "inherit", timeout: 240000 },
        );
      env.CHESS_COACH_PREINSTALLED_MARKETPLACE = "1";
    }
    execFileSync(
      process.env.CHESS_COACH_BWRAP || "bwrap",
      [
        "--unshare-net",
        "--unshare-pid",
        "--die-with-parent",
        "--ro-bind",
        "/",
        "/",
        "--dev",
        "/dev",
        "--proc",
        "/proc",
        "--tmpfs",
        "/tmp",
        "--bind",
        work,
        work,
        "--ro-bind",
        "/dev/null",
        "/usr/bin/flock",
        "--ro-bind",
        "/dev/null",
        "/usr/bin/python3",
        "--bind",
        profile,
        homedir(),
        "--chdir",
        work,
        process.execPath,
        runner,
        catalog,
        localReport,
      ],
      { env, stdio: "inherit", timeout: 180000 },
    );
  } else {
    if (process.env.CI !== "true")
      throw new Error(
        "macOS native acceptance must run on a disposable CI runner.",
      );
    const sandbox =
      '(version 1) (allow default) (deny network-outbound) (allow network-outbound (remote ip "localhost:*")) (deny process-exec (regex #".*/(python([0-9.]+)?|flock)$"))';
    execFileSync(
      "sandbox-exec",
      ["-p", sandbox, process.execPath, runner, catalog, localReport],
      { env, stdio: "inherit", cwd: work, timeout: 180000 },
    );
  }
  await mkdir(resolve(report, ".."), { recursive: true });
  await cp(localReport, report);
} finally {
  await rm(work, { recursive: true, force: true });
}

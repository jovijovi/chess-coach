// Use Stockfish's factory API inside a dedicated, cancellable child process.
const { createInterface } = require("node:readline");
const { resolve } = require("node:path");
const script = resolve(process.argv[2]);
const queued = [];
let ready = false;
const engine = {
  locateFile: (file) =>
    file.includes(".wasm") ? script.replace(/\.js$/, ".wasm") : script,
  listener: (line) => process.stdout.write(String(line) + "\n"),
};
function run(command) {
  if (command === "quit") process.exit(0);
  try {
    Promise.resolve(
      engine.ccall("command", null, ["string"], [command], {
        async: command.startsWith("go "),
      }),
    ).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
createInterface({ input: process.stdin })
  .on("line", (command) => {
    if (command === "quit") process.exit(0);
    if (ready) run(command);
    else queued.push(command);
  })
  .on("close", () => process.exit(0));
require(script)()(engine)
  .then(function waitForReady() {
    if (engine._isReady && !engine._isReady())
      return setTimeout(waitForReady, 10);
    ready = true;
    queued.splice(0).forEach(run);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

import { callService, stopService } from "./runtime.js";
const command = process.argv[2] ?? "open";
if (command === "stop")
  console.log(
    (await stopService())
      ? "Chess service stopped. The saved game can still be restored."
      : "Chess service is not running.",
  );
else if (command === "open")
  console.log(JSON.stringify(await callService("show_board")));
else if (command === "call")
  console.log(
    JSON.stringify(
      await callService(process.argv[3], JSON.parse(process.argv[4] ?? "{}")),
    ),
  );
else {
  console.error("Usage: control.js open | stop | call <tool> [json]");
  process.exitCode = 1;
}

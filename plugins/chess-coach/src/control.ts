import { callService } from "./runtime.js";
import { control } from "./activation.js";
const command = process.argv[2] ?? "open";
try {
  if (["stop", "doctor", "clean-runtime"].includes(command))
    console.log(JSON.stringify(await control(command), null, 2));
  else if (command === "open")
    console.log(JSON.stringify(await callService("show_board")));
  else if (command === "call" && process.argv[3])
    console.log(
      JSON.stringify(
        await callService(process.argv[3], JSON.parse(process.argv[4] ?? "{}")),
      ),
    );
  else
    throw new Error(
      "Usage: control.js open | stop | doctor | clean-runtime | call <tool> [json]",
    );
} catch (error) {
  console.error((error as Error).message);
  process.exitCode = 1;
}

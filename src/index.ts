import { ipcMain } from "electron";
import CommandRunner from "./command-runner";
import WindowManager from "./window-builder";
import { GetAppContentPath } from "./utils/get-local-path";

(async () => {
  console.log("Starting the app.");

  const Run = await CommandRunner(GetAppContentPath(".molecular/commands"));
  const Open = await WindowManager(GetAppContentPath(".molecular/windows"));
  ipcMain.handle("call-molecule", (_, url, body) => Run(url, body));
  ipcMain.on("open-construct", (_, url, body) => Open(url, body));
  await Open("/", {});
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

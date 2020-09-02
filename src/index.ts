import { ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import CommandRunner from "./command-runner";
import WindowManager from "./window-builder";

(async () => {
  console.log("Starting the app.");
  const Run = await CommandRunner("./.molecular/commands");
  const Open = await WindowManager("./.molecular/windows");
  ipcMain.on("call-molecule", (_, url, body) => Run(url, body));
  ipcMain.on("open-construct", (_, url, body) => Open(url, body));
  Open("/", {});

  if (!process.env.IS_DEV) {
    autoUpdater.checkForUpdatesAndNotify();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

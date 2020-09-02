import { ipcMain, app } from "electron";
import Path from "path";
import CommandRunner from "./command-runner";
import WindowManager from "./window-builder";

(async () => {
  console.log("Starting the app.");
  if (process.env.IS_DEV) {
    app.getAppPath();
    const Run = await CommandRunner("./.molecular/commands");
    const Open = await WindowManager("./.molecular/windows");
    ipcMain.handle("call-molecule", (_, url, body) => Run(url, body));
    ipcMain.on("open-construct", (_, url, body) => Open(url, body));
    await Open("/", {});
  } else {
    app.getAppPath();
    const Run = await CommandRunner(
      Path.join(app.getAppPath(), ".molecular/commands")
    );
    const Open = await WindowManager(
      Path.join(app.getAppPath(), ".molecular/windows")
    );
    ipcMain.handle("call-molecule", (_, url, body) => Run(url, body));
    ipcMain.on("open-construct", (_, url, body) => Open(url, body));
    await Open("/", {});
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

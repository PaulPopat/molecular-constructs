import { app } from "electron";
import Path from "path";
import WindowManager from "./window-builder";

export async function OpenWindow(url: string, body: any) {
  if (process.env.IS_DEV) {
    const Open = await WindowManager("./.molecular/windows");
    await Open(url, body);
  } else {
    const Open = await WindowManager(
      Path.join(app.getAppPath(), ".molecular/windows")
    );
    await Open(url, body);
  }
}

import { app } from "electron";
import Path from "path";

export function GetAppContentPath(path: string) {
  if (process.env.IS_DEV) {
    return "./" + path;
  }

  return Path.join(app.getAppPath(), path);
}

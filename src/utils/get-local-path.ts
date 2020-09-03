import { app } from "electron";
import Path from "path";

export function GetAppContentPath(path: string) {
  if (process.env.IS_DEV) {
    return Path.join(app.getAppPath(), path);
  }

  return "./" + path;
}

import { ipcRenderer } from "electron";

export function Request(url: string, method: string, body: any): Promise<unknown> {
  return ipcRenderer.invoke("call-molecule", url, method, body);
}

export function OpenWindow(url: string, body: any) {
  return ipcRenderer.send("open-construct", url, body);
}

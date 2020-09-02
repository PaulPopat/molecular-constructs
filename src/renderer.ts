import { ipcRenderer } from "electron";

export function Request(url: string, body: any) {
  return ipcRenderer.invoke("call-molecule", url, body);
}

export function OpenWindow(url: string, body: any) {
  return ipcRenderer.invoke("open-construct", url, body);
}

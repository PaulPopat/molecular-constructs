import WindowManager from "./window-builder";

export async function LoadWindow(url: string, body: any) {
  const Open = await WindowManager("./.molecular/windows");
  await Open(url, body);
}

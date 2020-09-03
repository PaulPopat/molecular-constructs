import WindowManager from "./window-builder";
import { GetAppContentPath } from "./utils/get-local-path";

export async function OpenWindow(url: string, body: any) {
  const Open = await WindowManager(GetAppContentPath(".molecular/windows"));
  await Open(url, body);
}

export { GetAppContentPath } from "./utils/get-local-path";

import fs from "fs-extra";
import { BrowserWindow } from "electron";
import StateKeeper from "electron-window-state";
import { ReadDirectory } from "./file-system";
import { FindMatch } from "./utils/url-matcher";
import { PathToUrl } from "./utils/path-to-url";

export default async function (root: string) {
  const window_roots = await ReadDirectory(root);
  const windows = window_roots
    .filter((c) => c.endsWith(".js"))
    .map((c) => ({
      url: PathToUrl(c, root),
      import: c,
    }))
    .reduce((c, n) => ({ ...c, [n.url]: n.import }), {} as NodeJS.Dict<string>);
  const urls = Object.keys(windows);
  for (const url of urls) {
    console.log("Registered window " + url);
  }

  return async (url: string, body: any) => {
    console.log(url);

    const match = FindMatch(url, urls);
    const details = windows[match.match];
    if (!details) {
      throw new Error("Window " + url + " not found");
    }

    const config = await fs.readJson(details.replace(".js", ".json"));
    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>${config.title}</title>
    ${
      config.css
        ? `<link rel="stylesheet" type="text/css" href="${config.css}" />`
        : ""
    }
  </head>
  <body style="padding: 0; margin: 0;">
    <div id="react-root"></div>
    <script>
      require("@babel/polyfill");
      const React = require("react");
      const ReactDom = require("react-dom");
      const Action = require("${details.replace(/\\/gm, "/")}").default;
      const dom_container = document.querySelector("#react-root");
      ReactDom.render(
        React.createElement(
          Action,
          {
            body: ${JSON.stringify(body)},
            params: ${JSON.stringify(match.params)}
          }
        ),
        dom_container
      )
    </script>
  </body>
</html>`;

    const state = StateKeeper({
      defaultWidth: config.window.width,
      defaultHeight: config.window.height,
      file: url.replace(/\//gm, "_-_") + ".json",
    });

    const window = new BrowserWindow({
      ...config.window,
      x: state.x,
      y: state.y,
      width: state.width,
      height: state.height,
    });

    if (process.env.IS_DEV) {
      window.webContents.openDevTools();
    }

    window.loadURL("data:text/html;charset=UTF-8," + encodeURIComponent(html));

    state.manage(window);
  };
}

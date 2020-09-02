import fs from "fs-extra";
const { spawn } = require("child_process");

export async function Initialise() {
  await fs.outputJson(
    "./.babelrc",
    {
      presets: [
        "@babel/preset-env",
        "@babel/preset-typescript",
        "@babel/react",
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        [
          "@babel/plugin-transform-runtime",
          {
            regenerator: true,
          },
        ],
      ],
    },
    { spaces: 2 }
  );

  await fs.outputFile(
    "./src/windows/index.tsx",
    `import React from "react";

// As this is the index. It will be loaded at the app start, with empty props and params.
export default (props: unknown, params: unknown) => {
  return <div>Hello world</div>;
}
`
  );

  await fs.outputJson(
    "./src/windows/index.json",
    {
      title: "Welcome to Molecular Constructs",
      window: {
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
        },
      },
    },
    { spaces: 2 }
  );

  await fs.outputFile(
    "./src/commands/index.ts",
    `export default async (props: unknown, params: unknown) => {
  return {};
}
`
  );

  if (!(await fs.pathExists("./package.json"))) {
    console.log("No package.json exists. Initialising a new NPM project.");
    await new Promise((res, rej) => {
      const spawned = spawn("npm", ["init", "-y"]);
      spawned.on("close", (code: number) => {
        if (code !== 0) {
          rej("NPM init failed with status " + code);
        } else {
          res();
        }
      });
    });
  }

  const package_json = await fs.readJson("./package.json");
  await fs.writeJson(
    "./package.json",
    {
      ...package_json,
      main: "./.molecular/.library-code/index.js",
    },
    { spaces: 2 }
  );
}

#!/usr/bin/env node

const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs-extra");

const options = ["dev", "init", "package"];

const command =
  process.argv.find((a) => options.find((o) => o === a) != null) ?? "dev";

if (command === "init") {
  console.log("Creating a basic project");
  require("../lib/initialise")
    .Initialise()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {NodeJS.Dict<string>} env
 */
function ExecuteNode(command, args, env) {
  return new Promise((res, rej) => {
    let command_name = command;
    if (process.platform === "win32") {
      command_name = command_name + ".cmd";
    }

    const spawned = spawn(
      path.join(".", "node_modules", ".bin", command_name),
      args,
      { env: env }
    );

    spawned.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    spawned.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    spawned.on("close", (code) => {
      if (code !== 0) {
        rej(
          `Process ${command} ${args.join(" ")} failed with exit code ${code}`
        );
      } else {
        res();
      }
    });
  });
}

if (command === "dev") {
  console.log("Compiling and starting the app in dev mode");
  require("../lib/compiler")
    .CompileCode("./src")
    .then(() => {
      ExecuteNode("electron", [path.join(__dirname, "..", "lib")], {
        IS_DEV: "true",
      });
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

if (command === "package") {
  console.log("Packaging app using electron-builder");
  const args = process.argv.filter(
    (a) =>
      [...options, "molecular"].find((o) => o === a) == null &&
      !a.includes("/") &&
      !a.includes("\\")
  );
  fs.copy(path.join(__dirname, "..", "lib"), "./.molecular/.library-code", {
    recursive: true,
  });
  require("../lib/compiler")
    .CompileCode("./src")
    .then(async () => {
      await ExecuteNode("electron-builder", ["install-app-deps"]);
      await ExecuteNode("electron-builder", ["build", ...args]);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

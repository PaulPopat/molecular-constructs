import fs from "fs-extra";
import * as Babel from "@babel/core";
import { ReadDirectory } from "./file-system";
import { ReplaceBase } from "./utils/path-replace-base";

export async function CompileCode(root: string) {
  const babel_config = await fs.readJson("./.babelrc");
  if (!babel_config.presets || !Array.isArray(babel_config.presets)) {
    babel_config.presets = ["@babel/react"];
  }

  if (!babel_config.presets.find((p: string) => p === "@babel/react")) {
    babel_config.presets.push("@babel/react");
  }

  const files = await ReadDirectory(root);
  for (const file of files) {
    if (
      file.endsWith(".js") ||
      file.endsWith(".jsx") ||
      file.endsWith(".ts") ||
      file.endsWith(".tsx")
    ) {
      const result = await Babel.transformFileAsync(file, babel_config);
      await fs.outputFile(
        ReplaceBase(
          file.split(".").slice(0, -1).join(".") + ".js",
          root,
          "./.molecular"
        ),
        result?.code ?? "",
        "utf-8"
      );
    } else {
      await fs.copy(file, ReplaceBase(file, root, "./.molecular"));
    }
  }
}

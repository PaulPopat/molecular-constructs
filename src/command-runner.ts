import { ReadDirectory } from "./file-system";
import { FindMatch } from "./utils/url-matcher";
import { PathToUrl } from "./utils/path-to-url";
import Path from "path";

export default async function (root: string) {
  const command_roots = await ReadDirectory(root);
  const commands = command_roots
    .filter((c) => c.endsWith(".js"))
    .map((c) => ({
      url: PathToUrl(c, root),
      imported: require(Path.resolve(c)).default,
    }))
    .reduce(
      (c, n) => ({ ...c, [n.url]: n.imported }),
      {} as NodeJS.Dict<(body: any, params: any) => Promise<any>>
    );
  const urls = Object.keys(commands);
  for (const url of urls) {
    console.log("Registered command " + url);
  }

  return async (url: string, body: any) => {
    const match = FindMatch(url, urls);
    const command = commands[match.match];
    if (!command) {
      throw new Error("Command " + url + " not found");
    }

    const result = await command(body, match.params);
    return result;
  };
}

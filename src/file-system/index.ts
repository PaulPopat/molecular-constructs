import fs from "fs-extra";

export async function ReadDirectory(route: string): Promise<string[]> {
  const result: string[] = [];
  const files = await fs.readdir(route);
  for (const file of files) {
    const p = route + "/" + file;
    const stats = await fs.stat(p);
    if (stats.isDirectory()) {
      result.push(...(await ReadDirectory(p)));
    } else {
      result.push(p);
    }
  }

  return result;
}

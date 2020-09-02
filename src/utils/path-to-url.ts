import Path from "path";

export function PathToUrl(path: string, base: string) {
  const transformed_path = path.replace(/\\/gm, "/");
  const transformed_base = base.replace(/\\/gm, "/");
  const extension = Path.extname(path);
  let result = transformed_path
    .replace(transformed_base, "")
    .replace(extension, "");

  if (result.endsWith("/index")) {
    result = result.substr(0, result.length - 6);
  }

  if (!result.startsWith("/")) {
    return "/" + result;
  }

  return result;
}

export function FindMatch(url: string, options: string[]) {
  let valid = options.map((o) => o.split("/").filter((i) => i));
  let params: NodeJS.Dict<string> = {};
  const split = url.split("/").filter((p) => p);
  for (let i = 0; i < split.length; i++) {
    const segment = split[i];
    for (const option of valid) {
      const part = option[i];
      if (part.startsWith("[") && !valid.find((v) => v[i] === segment)) {
        params[part.replace("[", "").replace("]", "")] = segment;
        continue;
      }

      if (part !== segment) {
        valid = valid.filter((v) => v !== option);
      }
    }

    if (valid.length === 0) {
      throw new Error("No matching URL for " + url);
    }
  }

  return {
    match: "/" + valid[0].join("/"),
    params: params,
  };
}

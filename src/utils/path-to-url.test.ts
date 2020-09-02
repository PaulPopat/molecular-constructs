import { PathToUrl } from "./path-to-url";

it.each([
  ["./test/part/other", "./test", "/part/other"],
  ["./test/part/other.js", "./test", "/part/other"],
  ["./test/part/index.js", "./test", "/part"],
  [".\\test\\part\\other", "./test", "/part/other"],
  [".\\test\\part\\other", "./test/", "/part/other"],
])("Transforms %s with %s into %s", (path, base, target) => {
  expect(PathToUrl(path, base)).toBe(target);
});

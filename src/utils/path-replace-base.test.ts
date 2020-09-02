import { ReplaceBase } from "./path-replace-base";

it.each([
  ["./test/part/other", "./test", "./other_test", "./other_test/part/other"],
  [
    "./test/part/other.js",
    "./test",
    "./other_test",
    "./other_test/part/other.js",
  ],
  [".\\test\\part\\other", "./test", "./other_test", "./other_test/part/other"],
  [
    ".\\test\\part\\other",
    "./test/",
    "./other_test",
    "./other_test/part/other",
  ],
])("Transforms %s with %s and %s into %s", (path, base, new_base, target) => {
  expect(ReplaceBase(path, base, new_base)).toBe(target);
});

import { FindMatch } from "./url-matcher";

it("Matches a basic url", () => {
  expect(FindMatch("/test/url", ["/test/url", "/other/test"])).toStrictEqual({
    match: "/test/url",
    params: {},
  });
});

it("Matches an empty url", () => {
  expect(FindMatch("/", ["/", "/other/test"])).toStrictEqual({
    match: "/",
    params: {},
  });
});

it("Matches an empty url with a single length one", () => {
  expect(FindMatch("/", ["/other", "/"])).toStrictEqual({
    match: "/",
    params: {},
  });
});

it("Matches urls of different lengths", () => {
  expect(FindMatch("/test", ["/", "/other/test", "/test"])).toStrictEqual({
    match: "/test",
    params: {},
  });
});

it("Throws if there is no match", () => {
  expect(() => FindMatch("/test/url", [])).toThrowError(
    "No matching URL for /test/url"
  );
});

it("Matches a url parameter", () => {
  expect(FindMatch("/test/url", ["/test/[part]", "/other/test"])).toStrictEqual(
    {
      match: "/test/[part]",
      params: { part: "url" },
    }
  );
});

it("Matches multiple parameters", () => {
  expect(
    FindMatch("/test/url/another/url-bit", [
      "/test/[part]/another/[part2]",
      "/other/test",
    ])
  ).toStrictEqual({
    match: "/test/[part]/another/[part2]",
    params: { part: "url", part2: "url-bit" },
  });
});

it("Chooses chooses no parameters if possible", () => {
  expect(
    FindMatch("/test/url/another/url-bit", [
      "/test/[part]/another/[part2]",
      "/test/url/another/[part2]",
      "/other/test",
    ])
  ).toStrictEqual({
    match: "/test/url/another/[part2]",
    params: { part2: "url-bit" },
  });
});

import { formatPluginResult } from "@/lib/services/pluginService";

describe("formatPluginResult", () => {
  it("formats an object result as pretty JSON", () => {
    const input = { msg: "hello", count: 2 };
    const output = formatPluginResult(input);
    expect(output).toMatch(/"msg": "hello"/);
    expect(output).toMatch(/"count": 2/);
  });

  it("converts a string directly", () => {
    expect(formatPluginResult("test")).toBe("test");
  });

  it("converts a number directly", () => {
    expect(formatPluginResult(123)).toBe("123");
  });

  it("handles null and undefined gracefully", () => {
    expect(formatPluginResult(null)).toBe("null");
    expect(formatPluginResult(undefined)).toBe("undefined");
  });
});

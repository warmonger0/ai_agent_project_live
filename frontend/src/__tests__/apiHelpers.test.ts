import { unwrapApiResponse } from "@/lib/utils/apiHelpers";

describe("unwrapApiResponse", () => {
  it("unwraps nested { data: { data: value } }", () => {
    const mock = { data: { data: "unwrapped" } };
    expect(unwrapApiResponse(mock)).toBe("unwrapped");
  });

  it("falls back to { data: value } if nested key is missing", () => {
    const mock = { data: "shallow" };
    expect(unwrapApiResponse(mock)).toBe("shallow");
  });

  it("handles empty or undefined input safely", () => {
    expect(unwrapApiResponse(undefined)).toBeUndefined();
    expect(unwrapApiResponse(null)).toBeUndefined();
  });

  it("handles unexpected structure gracefully", () => {
    const weird = { somethingElse: 42 };
    expect(unwrapApiResponse(weird)).toBeUndefined();
  });
});

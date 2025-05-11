// File: src/components/LogViewer/LogViewer.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import { unwrapApiResponse } from "@/lib/services/api";

// ✅ Mock `api.get` directly, not imported `default` from above
const get = vi.fn();

vi.mock("@/lib/services/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/services/api")>(
    "@/lib/services/api"
  );
  return {
    ...actual,
    default: { get }, // 👈 override just `.get`
    unwrapApiResponse: (res: any) => res.data,
  };
});

describe("Log Viewer API", () => {
  beforeEach(() => {
    get.mockReset();
  });

  it("should return a list of log files", async () => {
    get.mockResolvedValueOnce({
      data: ["healing.log", "test.log"],
    });

    const api = (await import("@/lib/services/api")).default;
    const unwrap = (await import("@/lib/services/api")).unwrapApiResponse;

    const res = await api.get("/api/v1/logs");
    const files = unwrap<string[]>(res);

    expect(Array.isArray(files)).toBe(true);
    expect(files).toContain("healing.log");
  });

  it("should return contents of a real log file", async () => {
    get
      .mockResolvedValueOnce({
        data: ["healing.log", "test.log"],
      })
      .mockResolvedValueOnce({
        data: "healing started...\nall good",
      });

    const api = (await import("@/lib/services/api")).default;
    const unwrap = (await import("@/lib/services/api")).unwrapApiResponse;

    const res = await api.get("/api/v1/logs");
    const files = unwrap<string[]>(res);

    if (!Array.isArray(files)) throw new Error("Expected an array of files");

    const logFile = files.find(
      (name) => name.includes("healing") || name.includes("test")
    );
    expect(logFile).toBeDefined();

    const contentRes = await api.get(`/api/v1/logs/${logFile}`);
    const content = unwrap<string>(contentRes);

    expect(typeof content).toBe("string");
    expect(content.length).toBeGreaterThan(0);
  });
});

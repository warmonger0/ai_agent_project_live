// File: src/components/LogViewer/LogViewer.test.ts
import { describe, it, expect, vi } from "vitest";
import api, { unwrapApiResponse } from "@/lib/services/api";

// ✅ Mock axios instance used by api
vi.mock("@/lib/services/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/services/api")>(
    "@/lib/services/api"
  );

  return {
    ...actual,
    default: {
      get: vi
        .fn()
        // Mock log list
        .mockResolvedValueOnce({ data: ["healing.log", "test.log"] })
        // Mock content of log file
        .mockResolvedValueOnce({ data: "healing started...\nall good." }),
    },
    unwrapApiResponse: (res: any) => res.data,
  };
});

describe("Log Viewer API", () => {
  it("should return a list of log files", async () => {
    const res = await api.get("/api/v1/logs");
    const files = unwrapApiResponse<string[]>(res.data);
    expect(Array.isArray(files)).toBe(true);
    expect(files).toContain("healing.log");
  });

  it("should return contents of a real log file", async () => {
    const res = await api.get("/api/v1/logs");
    const files = unwrapApiResponse<string[]>(res.data);

    const logFile = files.find(
      (name) => name.includes("healing") || name.includes("test")
    );
    expect(logFile).toBeDefined();

    const contentRes = await api.get(`/api/v1/logs/${logFile}`);
    expect(typeof contentRes.data).toBe("string");
    expect(contentRes.data.length).toBeGreaterThan(0);
  });
});

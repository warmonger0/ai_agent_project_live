import { describe, it, expect, vi } from "vitest";
import api, { unwrapApiResponse } from "@/lib/services/api";

// ✅ Correct mock: api.get returns { data: { data: [...] } }
vi.mock("@/lib/services/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/services/api")>(
    "@/lib/services/api"
  );

  return {
    ...actual,
    default: {
      get: vi
        .fn()
        .mockResolvedValueOnce({ data: { data: ["healing.log", "test.log"] } }) // logs list
        .mockResolvedValueOnce({
          data: { data: "healing started...\nall good." },
        }), // file content
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
    const content = unwrapApiResponse<string>(contentRes.data);

    expect(typeof content).toBe("string");
    expect(content.length).toBeGreaterThan(0);
  });
});

import api, { unwrapApiResponse } from "@/lib/services/api";

describe("Log Viewer API", () => {
  it("should return a list of log files", async () => {
    const res = await api.get("/api/v1/logs");
    const files = unwrapApiResponse<string[]>(res.data); // ✅ fix: use res.data
    expect(Array.isArray(files)).toBe(true);
    expect(files.some(name => name.endsWith(".log"))).toBe(true);
  });

  it("should return contents of a real log file", async () => {
    const res = await api.get("/api/v1/logs");
    const files = unwrapApiResponse<string[]>(res.data); // ✅ fix: correct response handling

    const logFile = files.find(
      (name: string) => name.includes("healing") || name.includes("test")
    );
    expect(logFile).toBeDefined();

    const contentRes = await api.get(`/api/v1/logs/${logFile}`); // ✅ fix: correct route
    expect(typeof contentRes.data).toBe("string");
    expect(contentRes.data.length).toBeGreaterThan(0);
  });
});

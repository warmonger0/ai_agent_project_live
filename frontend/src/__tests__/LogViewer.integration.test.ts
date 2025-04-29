import axios from "axios";

describe("Log Viewer API", () => {
  const BASE = "http://localhost:8000";

  it("should return a list of log files", async () => {
    const res = await axios.get(`${BASE}/logs`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.some((name) => name.endsWith(".log"))).toBe(true);
  });

  it("should return contents of a real log file", async () => {
    const { data: logs } = await axios.get(`${BASE}/logs`);
    const testLog = logs.find(
      (name: string) => name.includes("test") || name.includes("deployment"),
    );
    expect(testLog).toBeDefined();

    const content = await axios.get(`${BASE}/logs/${testLog}`, {
      responseType: "text",
    });
    expect(typeof content.data).toBe("string");
    expect(content.data.length).toBeGreaterThan(0);
  });
});

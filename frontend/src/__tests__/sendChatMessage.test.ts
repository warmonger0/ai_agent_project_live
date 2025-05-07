it("should throw an error if the response is not ok", async () => {
  // @ts-ignore
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ detail: "Internal Server Error" }),
    })
  );

  const mockRequest: ChatRequest = {
    messages: [{ role: "user", content: "Trigger failure" }],
  };

  await expect(sendChatMessage(mockRequest)).rejects.toThrow(
    "Network response was not ok"
  );
});

it("should throw if VITE_API_BASE_URL is undefined", async () => {
  const originalBaseUrl = import.meta.env.VITE_API_BASE_URL;
  // @ts-ignore
  delete import.meta.env.VITE_API_BASE_URL;

  const mockRequest: ChatRequest = {
    messages: [{ role: "user", content: "Missing env" }],
  };

  await expect(sendChatMessage(mockRequest)).rejects.toThrow(
    "VITE_API_BASE_URL is not defined"
  );

  // Restore base URL
  import.meta.env.VITE_API_BASE_URL = originalBaseUrl;
});

it("should throw if response is not valid JSON", async () => {
  // @ts-ignore
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    })
  );

  const mockRequest: ChatRequest = {
    messages: [{ role: "user", content: "Invalid JSON" }],
  };

  await expect(sendChatMessage(mockRequest)).rejects.toThrow("Invalid JSON");
});

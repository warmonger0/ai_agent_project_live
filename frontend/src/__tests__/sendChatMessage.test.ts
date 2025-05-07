type ChatRequest = {
  messages: { role: string; content: string }[];
};

it("should throw an error if the response is not ok", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ detail: "Internal Server Error" }),
    })
  ) as unknown as typeof fetch;

  const mockRequest: ChatRequest = {
    messages: [{ role: "user", content: "Trigger failure" }],
  };

  await expect(sendChatMessage(mockRequest, "http://fake-url")).rejects.toThrow(
    "Network response was not ok"
  );
});

it("should throw if VITE_API_BASE_URL is undefined", async () => {
  const mockRequest: ChatRequest = {
    messages: [{ role: "user", content: "Missing env" }],
  };

  // DO NOT pass override; simulate missing VITE_API_BASE_URL
  const originalBaseUrl = import.meta.env.VITE_API_BASE_URL;
  // @ts-expect-error
  delete import.meta.env.VITE_API_BASE_URL;

  await expect(sendChatMessage(mockRequest)).rejects.toThrow(
    "VITE_API_BASE_URL is not defined"
  );

  // Restore
  // @ts-expect-error
  import.meta.env.VITE_API_BASE_URL = originalBaseUrl;
});

it("should throw if response is not valid JSON", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.reject(new Error("Invalid JSON")),
    })
  ) as unknown as typeof fetch;

  const mockRequest: ChatRequest = {
    messages: [{ role: "user", content: "Invalid JSON" }],
  };

  await expect(sendChatMessage(mockRequest, "http://fake-url")).rejects.toThrow(
    "Invalid JSON"
  );
});

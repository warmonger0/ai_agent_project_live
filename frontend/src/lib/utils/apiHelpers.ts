// Handles nested `{ data: { ... } }` API responses
export function unwrapApiResponse<T = unknown>(response: any): T {
    const { data } = response ?? {};
  
    if (
      import.meta.env.MODE === "development" &&
      (data == null || !("data" in data))
    ) {
      console.warn("⚠️ Unexpected API response structure:", response);
    }
  
    return data?.data ?? data;
  }
  
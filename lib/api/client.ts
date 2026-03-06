export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "/http") {
    this.baseUrl = baseUrl;
  }

  async handleRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        error: data.error || "API Request failed",
        status: response.status,
      };
    }

    return data as T;
  }

  get<T>(endpoint: string): Promise<T> {
    return this.handleRequest<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.handleRequest<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.handleRequest<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.handleRequest<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

// Export error type for service layers
export type ApiError = {
  error: string;
  status: number;
};

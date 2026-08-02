const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errorSources?: any;
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = typeof window !== "undefined" ? localStorage.getItem("rentnest_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = token;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // send cookies (accessToken/refreshToken)
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok || data.success === false) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data as ApiResponse<T>;
  } catch (err: any) {
    if (err.name === "TypeError" && err.message === "Failed to fetch") {
      throw new Error("Cannot connect to backend server. Please verify the backend API is running.");
    }
    throw new Error(err.message || "An unexpected network error occurred");
  }
}

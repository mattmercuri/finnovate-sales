export const AUTH_EXPIRED_EVENT = "auth:expired";

type ApiErrorCode = "HTTP_ERROR" | "AUTH_REFRESH_FAILED" | "NETWORK_ERROR";

export class ApiError extends Error {
  status?: number;
  url: string;
  method: string;
  data?: unknown;
  code: ApiErrorCode;

  constructor({
    message,
    url,
    method,
    status,
    data,
    code,
  }: {
    message: string;
    url: string;
    method: string;
    status?: number;
    data?: unknown;
    code: ApiErrorCode;
  }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
    this.method = method;
    this.data = data;
    this.code = code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

let refreshInFlight: Promise<void> | null = null;

function getMethod(options?: RequestInit): string {
  return options?.method?.toUpperCase() ?? "GET";
}

function getRefreshUrl(requestUrl: string): string {
  try {
    const url = new URL(requestUrl);
    return `${url.origin}/api/auth/refresh`;
  } catch {
    if (typeof window !== "undefined") {
      return new URL("/api/auth/refresh", window.location.origin).toString();
    }

    return "/api/auth/refresh";
  }
}

function isRefreshEndpoint(requestUrl: string): boolean {
  try {
    return new URL(requestUrl).pathname === "/api/auth/refresh";
  } catch {
    return requestUrl.endsWith("/api/auth/refresh");
  }
}

function notifyAuthExpired() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text.length > 0 ? text : undefined;
}

async function buildHttpError(response: Response, requestUrl: string, method: string): Promise<ApiError> {
  const data = await parseResponseBody(response);
  return new ApiError({
    message: `Request failed with status ${response.status}`,
    url: requestUrl,
    method,
    status: response.status,
    data,
    code: "HTTP_ERROR",
  });
}

async function refreshSession(requestUrl: string): Promise<void> {
  if (!refreshInFlight) {
    const refreshUrl = getRefreshUrl(requestUrl);
    refreshInFlight = (async () => {
      try {
        const response = await fetch(refreshUrl, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          throw await buildHttpError(response, refreshUrl, "POST");
        }
      } catch (error) {
        notifyAuthExpired();

        if (isApiError(error)) {
          throw new ApiError({
            message: "Refresh token exchange failed",
            url: error.url,
            method: error.method,
            status: 401,
            data: error.data,
            code: "AUTH_REFRESH_FAILED",
          });
        }

        throw new ApiError({
          message: "Refresh token exchange failed",
          url: refreshUrl,
          method: "POST",
          status: 401,
          data: error,
          code: "AUTH_REFRESH_FAILED",
        });
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  await refreshInFlight;
}

async function executeRequest<T>(
  requestUrl: string,
  options?: RequestInit,
  canRefresh = true,
): Promise<T> {
  const method = getMethod(options);

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      ...options,
      credentials: "include",
    });
  } catch (error) {
    throw new ApiError({
      message: "Network request failed",
      url: requestUrl,
      method,
      data: error,
      code: "NETWORK_ERROR",
    });
  }

  if (response.status === 401 && canRefresh && !isRefreshEndpoint(requestUrl)) {
    await refreshSession(requestUrl);
    return executeRequest<T>(requestUrl, options, false);
  }

  if (!response.ok) {
    throw await buildHttpError(response, requestUrl, method);
  }

  const data = await parseResponseBody(response);

  return { data, status: response.status, headers: response.headers } as T;
}

export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  return executeRequest<T>(url, options);
};

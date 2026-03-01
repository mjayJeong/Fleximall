export function getToken() {
  return localStorage.getItem("accessToken");
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers);

  if (token) headers.set("Authorization", `Bearer ${token}`);
  
  const isFormData = init.body instanceof FormData;
  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(input, { ...init, headers });
}
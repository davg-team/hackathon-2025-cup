import { deleteToken, getPayload, setToken } from "shared/jwt-tools";

export async function updateToken(token: string) {
  const url = "/api/auth/account/token";
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.ok) {
    localStorage.setItem("isLoggined", "true");
    const data = await response.json();
    setToken(data.access_token);

    const payload = getPayload(data.access_token);
    console.log(payload);
    // @ts-ignore
    if (payload.required.includes("registration")) {
      window.history.pushState({}, "", "/register");
    }
    return true;
  } else {
    localStorage.removeItem("isLoggined");
    deleteToken();
    return false;
  }
}

// TODO
export function create(token: string) {}
// TODO
export function sendOAuthCode(service: string, code: string) {}

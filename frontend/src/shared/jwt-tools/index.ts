/* eslint-disable @typescript-eslint/ban-ts-comment */
export type Role =
  | "fsp_staff"
  | "fsp_region_head"
  | "fsp_region_staff"
  | "root"
  | "sportsman";
type Required = "registration";
export type JWTPayload = {
  region_id: string;
  aud?: string;
  exp?: number;
  iat?: number;
  iss?: string;
  roles: Role[];
  sub?: string;
  required: Required[];
  avatar: string;
  email: string;
  first_name: string;
  last_name: string;
  second_name: string;
  phone: string;
  snils: string;
  tg_id: string;
  status: string;
};

function isTemproary(token: string) {
  const payload = getPayload(token);
  if (payload && payload.iss?.startsWith("social")) {
    return true;
  }

  return false;
}

function isExpired(token: string) {
  const payload = getPayload(token);
  if (payload) {
    //@ts-ignore
    const expDate = new Date(payload.exp * 1000);
    const currentDate = new Date();

    if (expDate > currentDate) {
      return false;
    }

    return true;
  } else {
    return true;
  }
}

function getPayload(token: string) {
  try {
    const payloadPart = token.split(".")[1];
    const payload: JWTPayload = JSON.parse(atob(payloadPart));
    return payload;
    //@ts-ignore
  } catch (e: unknwn) {
    console.log(e);
    return null;
  }
}

function deleteToken() {
  localStorage.removeItem("token");
  document.cookie = `token=; path=/; domain=.${window.location.hostname
    .split(".")
    .slice(-2)
    .join(".")}; max-age=-1; samesite=strict`;
}

function setToken(token: string) {
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; domain=.${window.location.hostname
    .split(".")
    .slice(-2)
    .join(".")}; max-age=31536000; samesite=strict`;
}

export { isTemproary, isExpired, getPayload, deleteToken, setToken };

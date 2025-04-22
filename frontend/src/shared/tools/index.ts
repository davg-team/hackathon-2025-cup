import { getPayload } from "shared/jwt-tools";

export function getTimeAsDayMonthYear(date: string) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  return `${day.toString().padStart(2, "0")}.${month.toString().padStart(2, "0")}.${year}`;
}

export function getTimeAsHoursMinutes(date: string) {
  const dateObj = new Date(date);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export const getFileBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString().split(",")[1]); // Убираем префикс типа данных
      } else {
        reject("Error reading file");
      }
    };

    reader.onerror = () => {
      reject("Error reading file");
    };

    reader.readAsDataURL(file);
  });
};

export function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/+^])/g, "\\$1") + "=([^;]*)",
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; domain=.${location.hostname.split(".").slice(-2).join(".")}; max-age=31536000; samesite=strict`;
}

export function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = getPayload(token);
    return payload?.roles;
  } else return null;
}

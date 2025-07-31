export function getAccessToken(): string | null {
  return localStorage.getItem("access");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh");
}

export function setAccessToken(token: string): void {
  localStorage.setItem("access", token);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem("refresh", token);
}

export function removeTokens(): void {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

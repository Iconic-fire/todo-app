import { getAccessToken, setAccessToken } from "./tokenStore";
import { plainAxios } from "../api/axios";
import { redirectToLogin } from "./redirects";
import { getExpiryFromToken } from "./utils";

/**
 * Schedules proactive refreshes based on in-memory access token expiry.
 * Works for cookie-based refresh: the refresh call uses the HttpOnly cookie.
 */

let timeoutId: ReturnType<typeof setTimeout> | null = null;
const SAFE_MARGIN_SECONDS = 60; // refresh 60s before expiry


export async function refreshAccessToken(): Promise<boolean> {
    try {
        const res = await plainAxios.post("/api/accounts/refresh/", null);
        const newAccess = res.data?.access;
        if (!newAccess) throw new Error("No access token returned");
        setAccessToken(newAccess);
        // schedule next refresh using new token
        scheduleRefreshFromAccessToken();
        return true;
    } catch (err) {
        // Failed to refresh -> force logout
        setAccessToken(null);
        redirectToLogin();
        return false;
    }
}

export function clearScheduledRefresh() {
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
}

export function scheduleRefreshFromAccessToken() {
    clearScheduledRefresh();

    const token = getAccessToken();
    if (!token) return;

    const exp = getExpiryFromToken(token);
    if (!exp) return;

    const nowSec = Date.now() / 1000;
    const refreshAtSec = exp - SAFE_MARGIN_SECONDS;
    const delayMs = Math.max(0, (refreshAtSec - nowSec) * 1000);

    // If already expired or very close, do an immediate refresh
    if (delayMs <= 0) {
        refreshAccessToken();
        return;
    }

    timeoutId = setTimeout(() => {
        refreshAccessToken();
    }, delayMs);
}

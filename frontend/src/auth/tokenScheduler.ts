import { getAccessToken, getCSRFToken, setAccessToken } from "./tokenStore";
import { unauthenticatedAccountsApi } from "../api";
import { redirectToLogin } from "./redirects";
import { getExpiryFromToken } from "./utils";

let timeoutId: ReturnType<typeof setTimeout> | null = null;
const SAFE_MARGIN_SECONDS = 60; // refresh 60s before expiry


export async function refreshAccessToken(): Promise<boolean> {
    try {
        const res = await unauthenticatedAccountsApi.accountsRefreshCreate({
            headers: { 'X-CSRFToken': getCSRFToken() }
        });
        setAccessToken(res.data.access);
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

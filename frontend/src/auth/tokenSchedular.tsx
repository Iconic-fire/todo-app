// src/auth/tokenScheduler.ts
import axios from "axios";
import { getRefreshToken, isTokenExpired, removeTokens, setAccessToken } from "./utils";
import { redirectToLogin } from "./redirects";
import { API_BASE_URL } from "../api/axios";

let intervalId: ReturnType<typeof setInterval> | null = null;

// every 4.5 min (token expires in 5)
const refreshInterval = 270_000;

export function startTokenRefreshScheduler() {
    if (intervalId !== null) return; // prevent multiple intervals

    intervalId = setInterval(async () => {
        const refreshToken = getRefreshToken();

        // Check if refresh token exists and is valid
        if (!refreshToken || isTokenExpired(refreshToken)) {
            console.warn("Refresh token missing or expired during scheduled refresh.");
            removeTokens();
            redirectToLogin();
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/accounts/refresh/`, {
                refresh: refreshToken,
            });

            const newAccessToken = response.data.access;
            if (newAccessToken) {
                setAccessToken(newAccessToken);
                console.log("[Scheduler] Access token refreshed");
            }
        } catch (error) {
            console.error("[Scheduler] Failed to refresh token:", error);
            removeTokens();
            redirectToLogin();
        }
    }, refreshInterval);
}

export function stopTokenRefreshScheduler() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { setNavigate } from "./redirects";
import { setAccessToken } from "./tokenStore";
import { scheduleRefreshFromAccessToken, clearScheduledRefresh } from "./tokenScheduler";
import { accountsApi, unauthenticatedAccountsApi } from "../api";
import { useLocation, useNavigate } from "react-router";

type AuthContextType = {
    isAuthenticated: boolean;
    initAuth: () => Promise<void>;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const hasInitialized = useRef(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // make SPA redirect helper available
    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    // call on app mount to attempt silent refresh (cookie-based)
    const initAuth = async () => {
        try {
            // attempt server-side refresh using cookie; response should contain access token
            const res = await unauthenticatedAccountsApi.accountsRefreshCreate();
            setAccessToken(res.data.access);
            setIsAuthenticated(true);
            // schedule proactive refresh
            scheduleRefreshFromAccessToken();
        } catch (err) {
            setAccessToken(null);
            setIsAuthenticated(false);

            // If user is on the login page and token refresh fails, stay on the login page
            if (location.pathname !== "/login") {
                navigate('/login', { replace: true });
            }
        }
    };

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            initAuth();
        }

        // setup cross-tab logout listener (BroadcastChannel preferred)
        const bcSupported = typeof window !== "undefined" && "BroadcastChannel" in window;
        let bc: BroadcastChannel | null = null;

        if (bcSupported) {
            bc = new BroadcastChannel("auth");
            bc.onmessage = (ev) => {
                if (ev.data === "logout") {
                    setAccessToken(null);
                    clearScheduledRefresh();
                    setIsAuthenticated(false);
                }
            };
        } else {
            const handler = () => {
                // handle storage events (other tabs)
                if (!localStorage.getItem("auth_ping")) {
                    setAccessToken(null);
                    clearScheduledRefresh();
                    setIsAuthenticated(false);
                }
            };
            window.addEventListener("storage", handler);
            return () => window.removeEventListener("storage", handler);
        }

        return () => {
            if (bc) bc.close();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const response = await accountsApi.accountsLoginCreate({
            email,
            password,
        });
        setAccessToken(response.data.access);
        setIsAuthenticated(true);
        scheduleRefreshFromAccessToken();
    };

    const logout = async () => {
        try {
            await accountsApi.accountsLogoutCreate();
        } catch (error: any) {
            // ignore server errors
            console.error("Logout failed:", error);
        } finally {
            setAccessToken(null);
            clearScheduledRefresh();
            setIsAuthenticated(false);
            // notify other tabs
            try {
                const bc = new BroadcastChannel("auth");
                bc.postMessage("logout");
                bc.close();
            } catch {
                // fallback: localStorage ping to trigger storage event
                localStorage.removeItem("auth_ping");
                localStorage.setItem("auth_ping", String(Date.now()));
            }
        }
    };

    // expose minimal auth context
    return (
        <AuthContext.Provider value={{ isAuthenticated, initAuth, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};

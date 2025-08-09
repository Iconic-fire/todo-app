import React, { createContext, useContext, useEffect, useState } from "react";
import { setNavigate } from "./redirects";
import { setAccessToken } from "./tokenStore";
import { scheduleRefreshFromAccessToken, clearScheduledRefresh } from "./tokenScheduler";
import { plainAxios } from "../api/axios";
import { useNavigate } from "react-router";
import { accountsApi } from "../api/main";

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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // make SPA redirect helper available
        setNavigate(navigate);
    }, [navigate]);

    // call on app mount to attempt silent refresh (cookie-based)
    const initAuth = async () => {
        try {
            // attempt server-side refresh using cookie; response should contain access token
            const res = await plainAxios.post("http://localhost:8000/api/accounts/refresh/", null);
            // const res = await plainAxios.post("/api/accounts/refresh/", null);
            const access = res.data?.access;
            console.log("AuthProvider initAuth response:", res.data);
            if (access) {
                setAccessToken(access);
                setIsAuthenticated(true);
                // schedule proactive refresh
                scheduleRefreshFromAccessToken();
            } else {
                console.log("No access token in refresh response");
                setAccessToken(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            setAccessToken(null);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        // run on mount
        initAuth();
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
        console.log("Login response:", response.data);
        setAccessToken(response.data.access);
        setIsAuthenticated(true);
        scheduleRefreshFromAccessToken();
    };

    const logout = async () => {
        try {
            // call server logout which must clear the refresh cookie server-side
            await plainAxios.post("/api/accounts/logout/", null);
        } catch {
            // ignore server errors
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

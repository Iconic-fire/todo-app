import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { accountsApi } from "../api";

export function ResetPasswordConfirm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [tokenValid, setTokenValid] = useState<boolean>(false);

    useEffect(() => {
        async function validateToken() {
            if (!uid || !token) {
                setError("Invalid reset link.");
                setLoading(false);
                return;
            }

            try {
                await accountsApi.accountsResetPasswordValidateRetrieve(token, uid);
                setTokenValid(true);
            } catch (err: any) {
                setError(err.response?.data?.error || "Invalid or expired reset link.");
            } finally {
                setLoading(false);
            }
        }

        validateToken();
    }, [uid, token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setFieldErrors({});
        setSuccessMessage(null);

        if (newPassword !== confirmPassword) {
            setFieldErrors({ confirmPassword: "Passwords do not match." });
            return;
        }

        try {
            setSubmitting(true);
            const response = await accountsApi.accountsPasswordResetConfirmCreate(
                token!,
                uid!,
                { password: newPassword, password2: confirmPassword }
            );

            setSuccessMessage(response.data.message || "Password reset successfully.");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            if (!err.response) {
                setError("Network error. Please try again later.");
            } else {
                const data = err.response.data;
                if (data.password) {
                    setFieldErrors({ password: data.password[0] });
                } else if (data.password2) {
                    setFieldErrors({ confirmPassword: data.password2[0] });
                } else {
                    setError(data.error || "Reset failed.");
                }
            }
        } finally {
            setSubmitting(false);
        }
    }

    if (loading || !tokenValid) {
        return (
            <div className="flex flex-col items-center justify-center h-svh bg-gray-100 dark:bg-gray-900">
                {loading ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                        <span className="text-xl text-gray-600 dark:text-gray-300">Verifying...</span>
                    </div>
                ) : (
                    <div
                        className="mt-6 p-4 w-96 text-center rounded-lg shadow-lg
                bg-red-100 text-red-800 border border-red-400
                dark:bg-red-700 dark:text-red-100 dark:border-red-500"
                    >
                        {error || "Invalid or expired reset link."}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-svh bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
                    Reset Your Password
                </h2>

                {successMessage && (
                    <div className="text-green-600 bg-green-100 p-4 rounded-lg mb-4">{successMessage}</div>
                )}

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-100 dark:bg-red-200 px-4 py-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {fieldErrors.password && (
                            <span className="text-sm text-red-500">{fieldErrors.password}</span>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {fieldErrors.confirmPassword && (
                            <span className="text-sm text-red-500">{fieldErrors.confirmPassword}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {submitting ? "Submitting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

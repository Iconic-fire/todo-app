import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { accountsApi } from '../api/main';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>('');
    const [success, setSuccess] = useState<boolean | null>(null);
    const navigate = useNavigate();

    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    async function verifyEmail(token: string, uid: string) {
        setLoading(true);
        try {
            const response = await accountsApi.accountsVerifyEmailRetrieve(token, uid);
            setStatusMessage(response.data.message);
            setSuccess(true);
            // Redirect after a few seconds
            setTimeout(() => navigate('/login', { replace: true }), 2000);
        } catch (err: any) {
            // Network error or no response
            if (!err.response) {
                setStatusMessage("Failed to verify account. Please try again later.");
            } else {
                setStatusMessage('Invalid or expired token.');
            }
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (uid && token) {
            verifyEmail(token, uid);
        } else {
            setStatusMessage('Invalid activation link.');
            setSuccess(false);
        }
    }, [uid, token, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-svh bg-gray-100 dark:bg-gray-900">
            {loading && (
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <span className="text-xl text-gray-600 dark:text-gray-300">Verifying...</span>
                </div>
            )}

            {!loading && statusMessage && success !== null && (
                <div
                    className={`mt-6 p-4 w-96 text-center rounded-lg shadow-lg border ${success
                        ? 'bg-green-100 text-green-800 border-green-400 dark:bg-green-700 dark:text-green-100 dark:border-green-500'
                        : 'bg-red-100 text-red-800 border-red-400 dark:bg-red-700 dark:text-red-100 dark:border-red-500'
                        }`}
                >
                    {statusMessage}
                </div>
            )}
        </div>
    );
}

export default VerifyEmail;

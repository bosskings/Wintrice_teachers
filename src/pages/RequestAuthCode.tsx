import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { SolidBlueBtn } from '../component/Btns';
import LoadingOverlay from '../component/LoadingOverlay';
import { useRequestAuthCode } from '../hooks/mutation/allMutattion';

const RequestAuthCode = () => {
    const [email, setEmail] = useState('');

    const { mutate: requestAuthCode, isPending } = useRequestAuthCode()

    const navigate = useNavigate();

    const handleRequest = (event: any) => {
        event.preventDefault();
        requestAuthCode({ email }, {
            onSuccess: () => {
                localStorage.setItem('wintriceAuthCodeRequested', 'true');
                toast.success('Auth code sent! Check your email.')
                setTimeout(() => navigate('/login'), 2000)
            },
            onError: (error: any) => {
                console.error('Request failed:', error);
                const message =
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    error?.response?.data?.error ||
                    (typeof error?.response?.data === 'string' ? error.response.data : null) ||
                    error?.message ||
                    'Request failed. Please try again.'
                toast.error(message)
            }
        })
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <LoadingOverlay visible={isPending} />
            <ToastContainer theme="dark" position="top-right" autoClose={4000} />

            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-neutral-200 p-10">

                {/* Brand */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight mb-1">Wintrice</h1>
                    <h2 className="text-lg font-semibold text-neutral-800">Request Auth Code</h2>
                    <p className="text-sm text-neutral-500 mt-1">
                        Enter your email address and we'll send your auth code
                    </p>
                </div>

                <form onSubmit={handleRequest} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-neutral-700 text-sm font-medium pb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full px-4 py-3 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <SolidBlueBtn title="Send Auth Code" />

                    <div className="text-center pt-1">
                        <span className="text-sm text-neutral-500">Already have your auth code? </span>
                        <span
                            onClick={() => navigate('/login')}
                            className="text-blue-600 text-sm cursor-pointer hover:underline"
                        >
                            Log in
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RequestAuthCode;
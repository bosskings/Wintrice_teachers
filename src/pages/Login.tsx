import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { SolidBlueBtn } from '../component/Btns';
import LoadingOverlay from '../component/LoadingOverlay';
import { useLogin } from '../hooks/mutation/allMutattion';

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');

    const { mutate: login, isPending } = useLogin()

    const navigate = useNavigate();

    const handleLogin = (event: any) => {
        event.preventDefault();
        login({ email, password }, {
            onSuccess: (res) => {
                const token = res.data.token
                localStorage.setItem('wintriceTeacherToken', token);
                toast.success('Login successful')
                setTimeout(() => navigate('/overview'), 1500)
            },
            onError: (error: any) => {
                const message =
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    error?.response?.data?.error ||
                    (typeof error?.response?.data === 'string' ? error.response.data : null) ||
                    error?.message ||
                    'Login failed. Please try again.'
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
                    <h2 className="text-lg font-semibold text-neutral-800">School Portal</h2>
                    <p className="text-sm text-neutral-500 mt-1">Log in to manage your institution</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">

                    {/* Access ID */}
                    <div>
                        <label className="block text-neutral-700 text-sm font-medium pb-2">
                            Email
                        </label>
                        <input
                            type="text"
                            value={email}
                            required
                            onChange={(e) => setemail(e.target.value)}
                            placeholder="Enter your email: "
                            className="w-full px-4 py-3 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Auth Code */}
                    <div>
                        <label className="block text-neutral-700 text-sm font-medium pb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setpassword(e.target.value)}
                            placeholder="Enter your pasword"
                            className="w-full px-4 py-3 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <SolidBlueBtn title="Log In" />
                </form>
            </div>
        </div>
    );
};

export default Login;
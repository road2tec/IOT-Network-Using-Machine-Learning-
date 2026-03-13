import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { LockClosedIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (new URLSearchParams(location.search).get('expired')) {
            setError('Your session has expired. Please login again.');
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const resp = await authService.login(username, password);
            const token = resp.data.access_token;
            localStorage.setItem('token', token);

            const userResp = await authService.getMe();
            const user = userResp.data;
            localStorage.setItem('user', JSON.stringify(user));

            if (user.is_admin) {
                navigate('/dashboard/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyber-purple/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-cyber-cyan/10 blur-[120px] rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row w-full max-w-5xl glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10"
            >
                {/* Left Side: Branding/Info */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-cyber-card to-slate-900 w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-dot-grid"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-12">
                            <div className="w-10 h-10 bg-cyber-cyan rounded-lg flex items-center justify-center shadow-[0_0_15px_#00F5D4]">
                                <ShieldCheckIcon className="w-6 h-6 text-slate-900" />
                            </div>
                            <span className="text-2xl font-bold tracking-tighter">IDS<span className="text-cyber-cyan text-3xl">.</span>XAI</span>
                        </div>

                        <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                            Secure Access
                            <br />
                            <span className="text-cyber-cyan">Terminal</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xs">
                            Enter your credentials to access the real-time intrusion detection and explainability dashboard.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></div>
                            <span className="text-xs font-mono text-cyber-cyan uppercase tracking-widest">Network Status</span>
                        </div>
                        <div className="text-sm font-mono text-gray-400">
                            Core: <span className="text-white">Active</span>
                            <br />
                            AI-Engine: <span className="text-white">Ready</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="md:hidden flex items-center gap-2 mb-8">
                            <div className="w-8 h-8 bg-cyber-cyan rounded flex items-center justify-center">
                                <ShieldCheckIcon className="w-5 h-5 text-slate-900" />
                            </div>
                            <span className="text-xl font-bold tracking-tighter">IDS<span className="text-cyber-cyan">.</span>XAI</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
                        <p className="text-gray-400 mb-8">Please login to your account.</p>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-cyber-cyan transition-colors">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyber-cyan">
                                        <UserIcon className="h-5 w-5 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/20 transition-all font-medium"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-cyber-purple transition-colors">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyber-purple">
                                        <LockClosedIcon className="h-5 w-5 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyber-purple/50 focus:ring-1 focus:ring-cyber-purple/20 transition-all font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-gradient-to-r from-cyber-purple to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 px-4 rounded-xl transition-all flex justify-center items-center shadow-lg shadow-cyber-purple/20 relative overflow-hidden group/btn"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                <span className="relative">
                                    {loading ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    ) : 'LOGIN'}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                            <p className="text-gray-400 text-sm">
                                Don't have an account? <Link to="/register" className="text-cyber-cyan font-bold hover:text-white transition-colors ml-1">Register here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

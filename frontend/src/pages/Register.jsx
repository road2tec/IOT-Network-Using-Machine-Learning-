import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { LockClosedIcon, UserIcon, EnvelopeIcon, ShieldCheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.register(formData);
            // Auto login
            const resp = await authService.login(formData.username, formData.password);
            localStorage.setItem('token', resp.data.access_token);

            const userResp = await authService.getMe();
            localStorage.setItem('user', JSON.stringify(userResp.data));

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-cyber-purple/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-cyber-cyan/10 blur-[120px] rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row-reverse w-full max-w-5xl glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10"
            >
                {/* Side: Branding/Info */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 to-cyber-card w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-dot-grid"></div>

                    <div className="relative z-10 text-right">
                        <div className="flex items-center justify-end gap-2 mb-12">
                            <span className="text-2xl font-bold tracking-tighter">IDS<span className="text-cyber-purple text-3xl">.</span>XAI</span>
                            <div className="w-10 h-10 bg-cyber-purple rounded-lg flex items-center justify-center shadow-[0_0_15px_#7C3AED]">
                                <ShieldCheckIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight uppercase tracking-tighter">
                            Free Security 
                            <br />
                            <span className="text-cyber-purple">Registration</span>
                        </h2>
                        <p className="text-gray-400 text-lg ml-auto max-w-xs leading-relaxed">
                            Create your account to start protecting your data with Explainable AI.
                        </p>
                    </div>

                    <div className="relative z-10 mt-12 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm self-end">
                        <div className="space-y-3">
                            <BenefitItem text="Access 10+ Attack Checks" />
                            <BenefitItem text="Real-time Visual Reports" />
                            <BenefitItem text="Private Data Analysis" />
                        </div>
                    </div>
                </div>

                {/* Main: Register Form */}
                <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col justify-center border-r border-white/5">
                    <div className="max-w-md mx-auto w-full">
                        <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Register Now</h3>
                        <p className="text-gray-400 mb-8 font-medium">Quick and easy access to security.</p>

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

                        <form onSubmit={handleRegister} className="space-y-5">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-cyber-purple transition-colors">Your Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyber-purple">
                                        <UserIcon className="h-5 w-5 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your name"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyber-purple/50 focus:ring-1 focus:ring-cyber-purple/20 transition-all font-medium"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-cyber-purple transition-colors">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyber-purple">
                                        <EnvelopeIcon className="h-5 w-5 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyber-purple/50 focus:ring-1 focus:ring-cyber-purple/20 transition-all font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-cyber-cyan transition-colors">Create Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyber-cyan">
                                        <LockClosedIcon className="h-5 w-5 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyber-cyan/50 focus:ring-1 focus:ring-cyber-cyan/20 transition-all font-medium"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-gradient-to-r from-cyber-cyan to-blue-500 hover:from-teal-400 hover:to-blue-400 text-slate-900 font-extrabold py-4 px-4 rounded-xl transition-all flex justify-center items-center shadow-lg shadow-cyber-cyan/30 relative overflow-hidden group/btn"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                <span className="relative">
                                    {loading ? (
                                        <div className="animate-spin h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full"></div>
                                    ) : 'CREATE ACCOUNT'}
                                </span>
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                            <p className="text-gray-400 text-sm">
                                Already have an account? <Link to="/login" className="text-cyber-purple font-bold hover:text-white transition-colors ml-1">Login here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function BenefitItem({ text }) {
    return (
        <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-cyber-purple" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{text}</span>
        </div>
    );
}

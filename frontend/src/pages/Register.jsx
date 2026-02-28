import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

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
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md border-t-2 border-t-cyber-purple shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Create Credentials</h2>
                {error && <div className="bg-red-500/20 border border-cyber-red text-red-200 p-3 rounded mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                        <input
                            type="text" required
                            className="w-full bg-slate-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple transition-all"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Communication (Email)</label>
                        <input
                            type="email" required
                            className="w-full bg-slate-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Secure Passcode</label>
                        <input
                            type="password" required
                            className="w-full bg-slate-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-cyber-cyan hover:bg-teal-400 text-slate-900 font-bold py-3 px-4 rounded transition-all flex justify-center items-center shadow-[0_0_15px_rgba(0,245,212,0.4)]"
                    >
                        {loading ? <span className="animate-spin h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full"></span> : 'Establish Uplink'}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already cleared? <Link to="/login" className="text-cyber-purple hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
}

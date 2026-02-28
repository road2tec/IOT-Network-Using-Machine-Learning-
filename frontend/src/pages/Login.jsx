import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
                navigate('/admin');
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
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md border-t-2 border-t-cyber-cyan shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">System Access</h2>
                {error && <div className="bg-red-500/20 border border-cyber-red text-red-200 p-3 rounded mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Operator ID (Username)</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Passcode</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyber-purple hover:bg-purple-600 text-white font-bold py-3 px-4 rounded transition-all flex justify-center items-center shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                    >
                        {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Authenticate'}
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-400 text-sm">
                    No clearance? <Link to="/register" className="text-cyber-cyan hover:underline">Request Access</Link>
                </p>
            </div>
        </div>
    );
}

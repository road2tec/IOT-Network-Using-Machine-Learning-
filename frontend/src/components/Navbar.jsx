import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;
    if (userStr) user = JSON.parse(userStr);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="border-b border-cyber-card bg-cyber-bg/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 font-bold text-2xl tracking-tighter">
                            <span className="text-cyber-cyan">IDS</span>
                            <span className="text-white">_XAI</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a href="/#features" className="text-gray-300 hover:text-cyber-cyan px-3 py-2 rounded-md font-medium transition-colors">Features</a>
                            <a href="/#how-it-works" className="text-gray-300 hover:text-cyber-cyan px-3 py-2 rounded-md font-medium transition-colors">How it works</a>
                            <a href="/#about" className="text-gray-300 hover:text-cyber-cyan px-3 py-2 rounded-md font-medium transition-colors">About</a>

                            {!token ? (
                                <>
                                    <Link to="/login" className="text-gray-300 hover:text-cyber-cyan px-3 py-2 rounded-md font-medium transition-colors">Login</Link>
                                    <Link to="/register" className="bg-cyber-purple/20 text-cyber-purple border border-cyber-purple hover:bg-cyber-purple hover:text-white px-4 py-2 rounded-md font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.6)]">Sign Up</Link>
                                </>
                            ) : (
                                <>
                                    <Link to={user?.is_admin ? "/admin" : "/dashboard"} className="text-gray-300 hover:text-cyber-cyan px-3 py-2 rounded-md font-medium transition-colors">Dashboard</Link>
                                    <button onClick={handleLogout} className="text-gray-300 hover:text-cyber-red px-3 py-2 rounded-md font-medium transition-colors">Logout</button>
                                    <span className="text-sm px-3 py-1 bg-cyber-card rounded-full border border-gray-600 text-gray-300">
                                        <span className="text-cyber-cyan mr-1">@</span>{user?.username}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

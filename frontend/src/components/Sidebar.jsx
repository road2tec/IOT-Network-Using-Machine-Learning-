import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
    CloudArrowUpIcon, 
    SignalIcon, 
    ShieldExclamationIcon, 
    ChartBarIcon,
    HomeIcon,
    ArrowLeftOnRectangleIcon,
    UsersIcon,
    ShieldCheckIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isAdminView = location.pathname.startsWith('/dashboard/admin');

    const userMenuItems = [
        { name: 'Home', path: '/dashboard', icon: <HomeIcon className="w-5 h-5" /> },
        { name: 'File Check', path: '/dashboard/analyze', icon: <CloudArrowUpIcon className="w-5 h-5" /> },
        { name: 'Live Tracking', path: '/dashboard/live', icon: <SignalIcon className="w-5 h-5" /> },
        { name: 'Threats', path: '/dashboard/threats', icon: <ShieldExclamationIcon className="w-5 h-5" /> },
        { name: 'My Reports', path: '/dashboard/reports', icon: <ChartBarIcon className="w-5 h-5" /> },
    ];

    const adminMenuItems = [
        { name: 'Admin Overview', path: '/dashboard/admin', icon: <ShieldCheckIcon className="w-5 h-5" /> },
        { name: 'Manage Users', path: '/dashboard/admin', icon: <UsersIcon className="w-5 h-5" /> },
        { name: 'All Reports', path: '/dashboard/admin', icon: <ChartBarIcon className="w-5 h-5" /> },
        { name: 'Exit Admin', path: '/dashboard', icon: <ArrowLeftIcon className="w-5 h-5" /> },
    ];

    let menuItems = isAdminView ? adminMenuItems : userMenuItems;

    // Add admin entry point if not in admin view
    if (!isAdminView && user?.is_admin) {
        menuItems.push({ 
            name: 'Admin Panel', 
            path: '/dashboard/admin', 
            icon: <ShieldCheckIcon className="w-5 h-5" /> 
        });
    }

    return (
        <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 h-screen fixed left-0 top-0 z-20 hidden md:flex flex-col p-4">
            <div className="space-y-2 flex-1">
                <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Navigation</p>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                            ${isActive 
                                ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 shadow-[0_0_15px_rgba(0,245,212,0.1)]' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                        `}
                    >
                        <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="font-bold text-sm tracking-tight">{item.name}</span>
                    </NavLink>
                ))}
            </div>

            <div className="p-4 bg-cyber-cyan/5 rounded-2xl border border-cyber-cyan/10 mt-auto">
                <p className="text-[10px] text-cyber-cyan font-bold uppercase mb-1">System Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_green]"></div>
                    <span className="text-[10px] text-gray-400 font-mono">NODE_01_ACTIVE</span>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
            >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                Logout
            </button>
        </div>
    );
}

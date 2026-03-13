import { Outlet, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import {
    ShieldCheckIcon,
    UsersIcon,
    ChartBarIcon,
    SignalIcon,
    ArrowLeftOnRectangleIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';

const adminMenuItems = [
    { name: 'Overview', path: '/admin', icon: <Squares2X2Icon className="w-5 h-5" />, end: true },
    { name: 'Manage Users', path: '/admin/users', icon: <UsersIcon className="w-5 h-5" /> },
    { name: 'System Reports', path: '/admin/reports', icon: <ChartBarIcon className="w-5 h-5" /> },
    { name: 'Live Monitor', path: '/admin/live', icon: <SignalIcon className="w-5 h-5" /> },
];

export default function AdminLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Admin Sidebar */}
            <div className="w-64 bg-slate-900/70 backdrop-blur-xl border-r border-cyber-purple/10 h-screen fixed left-0 top-0 z-20 hidden md:flex flex-col p-4">
                {/* Brand */}
                <div className="flex items-center gap-3 px-4 py-5 mb-4">
                    <div className="w-9 h-9 bg-cyber-purple rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                        <ShieldCheckIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="text-xs font-black text-white tracking-tighter">ADMIN</div>
                        <div className="text-[10px] text-cyber-purple font-bold uppercase tracking-widest">Control Center</div>
                    </div>
                </div>

                {/* Menu */}
                <div className="space-y-1 flex-1">
                    <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3">Admin Menu</p>
                    {adminMenuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                                ${isActive
                                    ? 'bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                            `}
                        >
                            <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="font-bold text-sm tracking-tight">{item.name}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Status */}
                <div className="p-4 bg-cyber-purple/5 rounded-2xl border border-cyber-purple/10 mt-auto mb-3">
                    <p className="text-[10px] text-cyber-purple font-bold uppercase mb-1">Admin Mode Active</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-gray-400 font-mono">MASTER_ACCESS</span>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 p-8 min-h-screen">
                <Outlet />
            </div>
        </div>
    );
}

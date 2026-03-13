import { useState, useEffect } from 'react';
import { 
    UsersIcon, 
    ShieldExclamationIcon, 
    ShieldCheckIcon, 
    ChartBarIcon,
    TrashIcon,
    ChevronRightIcon,
    SignalIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../services/api';
import { TrafficLineChart, AttackPieChart } from '../components/Charts';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                adminService.getStats(),
                adminService.getUsers()
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error("Failed to load admin stats", err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to remove this user?")) return;
        try {
            await adminService.deleteUser(id);
            fetchAdminData();
        } catch (e) {
            alert(e.response?.data?.detail || "Action failed");
        }
    };

    if (!stats) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase">Loading Admin Panel...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
                        <ShieldCheckIcon className="w-8 h-8 text-cyber-purple" />
                        Admin <span className="text-cyber-purple">Control Center</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">Manage users and monitor global system security.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-cyber-purple/10 border border-cyber-purple/20 px-4 py-2 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-cyber-purple animate-pulse"></div>
                    <span className="text-xs font-bold text-cyber-purple uppercase tracking-widest">Master Admin Mode</span>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AdminStatCard 
                    label="Total Users" 
                    value={stats.totalUsers} 
                    icon={<UsersIcon className="w-6 h-6 text-cyber-cyan" />} 
                    color="text-cyber-cyan"
                />
                <AdminStatCard 
                    label="Scans Done" 
                    value={stats.totalPredictions} 
                    icon={<SignalIcon className="w-6 h-6 text-gray-400" />} 
                    color="text-white"
                />
                <AdminStatCard 
                    label="Risky Acts" 
                    value={stats.totalAttacks} 
                    icon={<ShieldExclamationIcon className="w-6 h-6 text-red-500" />} 
                    color="text-red-500"
                />
                <AdminStatCard 
                    label="AI Accuracy" 
                    value={`${stats.accuracyRate}%`} 
                    icon={<ChartBarIcon className="w-6 h-6 text-green-500" />} 
                    color="text-green-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Global Scan Activity</h3>
                        <div className="text-[10px] text-gray-600 font-mono uppercase">Last 24 Hours</div>
                    </div>
                    <div className="h-80">
                        <TrafficLineChart data={stats.timeline} />
                    </div>
                </div>
                
                <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center">
                    <h3 className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest w-full text-left">Threat Ratio</h3>
                    <div className="w-full max-w-[280px] h-64">
                        <AttackPieChart
                            normal={stats.totalPredictions - stats.totalAttacks}
                            attack={stats.totalAttacks}
                        />
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Current Danger Level</p>
                        <p className={`text-2xl font-black ${stats.attackPercentage > 50 ? 'text-red-500' : 'text-cyber-cyan'}`}>
                            {stats.attackPercentage}% Risk
                        </p>
                    </div>
                </div>
            </div>

            {/* User Management Table */}
            <div className="glass-panel rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Users</h3>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Personnel Records</p>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 border border-white/5">
                        {users.length} Total Registered
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] text-gray-500 uppercase tracking-[0.2em] bg-white/[0.01]">
                                <th className="py-5 px-8 font-black">ID No.</th>
                                <th className="py-5 px-8 font-black">Username</th>
                                <th className="py-5 px-8 font-black">Email Address</th>
                                <th className="py-5 px-8 font-black">Account Type</th>
                                <th className="py-5 px-8 font-black text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.03] transition-colors group">
                                    <td className="py-5 px-8 text-xs font-mono text-gray-600">#{u.id.toString().padStart(4, '0')}</td>
                                    <td className="py-5 px-8 text-sm font-bold text-gray-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-400 uppercase">
                                                {u.username.substring(0, 2)}
                                            </div>
                                            {u.username}
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-sm text-gray-500">{u.email}</td>
                                    <td className="py-5 px-8">
                                        {u.is_admin ?
                                            <span className="text-[10px] font-black tracking-widest text-cyber-purple border border-cyber-purple/30 bg-cyber-purple/10 px-3 py-1 rounded-lg uppercase">System Admin</span> :
                                            <span className="text-[10px] font-black tracking-widest text-cyber-cyan border border-cyber-cyan/30 bg-cyber-cyan/10 px-3 py-1 rounded-lg uppercase">Standard User</span>
                                        }
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        {!u.is_admin ? (
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="opacity-0 group-hover:opacity-100 flex items-center gap-2 ml-auto text-xs font-bold text-red-500/70 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                Remove User
                                            </button>
                                        ) : (
                                            <div className="text-[10px] font-bold text-gray-700 italic uppercase">Protected Account</div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AdminStatCard({ label, value, color, icon }) {
    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    {icon}
                </div>
                <ChevronRightIcon className="w-4 h-4 text-gray-700" />
            </div>
            <div>
                <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">{label}</p>
            </div>
        </div>
    );
}

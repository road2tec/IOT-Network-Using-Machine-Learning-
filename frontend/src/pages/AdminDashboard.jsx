import { useState, useEffect } from 'react';
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
        if (!window.confirm("Delete this user?")) return;
        try {
            await adminService.deleteUser(id);
            fetchAdminData();
        } catch (e) {
            alert(e.response?.data?.detail || "Delete failed");
        }
    };

    if (!stats) return <div className="p-8 text-center animate-pulse">Loading Telemetry...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-cyber-purple">
                    Overlord Central Command
                </h1>
                <span className="bg-cyber-purple/20 text-cyber-purple border border-cyber-purple px-4 py-1 rounded-full text-sm font-bold shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                    Admin Access Granted
                </span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Global Users" value={stats.totalUsers} color="text-cyber-cyan" border="border-cyber-cyan" />
                <StatCard title="Total Packets Scanned" value={stats.totalPredictions} color="text-white" border="border-gray-600" />
                <StatCard title="Threats Detected" value={stats.totalAttacks} color="text-cyber-red" border="border-cyber-red" />
                <StatCard title="Engine Iteration Accuracy" value={`${stats.accuracyRate}%`} color="text-cyber-green" border="border-cyber-green" />
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-10">
                <div className="glass-panel p-6 rounded-2xl md:col-span-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                    <TrafficLineChart data={stats.timeline} />
                </div>
                <div className="glass-panel p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                    <h3 className="text-center font-bold mb-4 text-gray-300">Threat Distribution</h3>
                    <AttackPieChart
                        normal={stats.totalPredictions - stats.totalAttacks}
                        attack={stats.totalAttacks}
                    />
                    <div className="text-center mt-4 text-sm text-gray-400">
                        Current Attack Ratio: <span className="text-white">{stats.attackPercentage}%</span>
                    </div>
                </div>
            </div>

            {/* User Management */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Registered Personnel</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 text-sm">
                                <th className="py-2 px-4">ID</th>
                                <th className="py-2 px-4">Username</th>
                                <th className="py-2 px-4">Email</th>
                                <th className="py-2 px-4">Clearance Level</th>
                                <th className="py-2 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b border-gray-800/50 hover:bg-slate-800/30">
                                    <td className="py-3 px-4 text-gray-500">#{u.id}</td>
                                    <td className="py-3 px-4 font-mono">{u.username}</td>
                                    <td className="py-3 px-4 text-gray-400">{u.email}</td>
                                    <td className="py-3 px-4">
                                        {u.is_admin ?
                                            <span className="text-cyber-purple text-xs font-bold border border-cyber-purple px-2 py-1 rounded">ADMIN</span> :
                                            <span className="text-cyber-cyan text-xs border border-cyber-cyan px-2 py-1 rounded">USER</span>
                                        }
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        {!u.is_admin && (
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="text-red-400 hover:text-red-300 text-sm bg-red-900/20 px-3 py-1 rounded transition-colors"
                                            >
                                                Revoke Access
                                            </button>
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

function StatCard({ title, value, color, border }) {
    return (
        <div className={`glass-panel p-6 rounded-2xl border-l-[3px] ${border} hover:bg-slate-800/50 transition-colors`}>
            <h4 className="text-sm text-gray-400 uppercase tracking-widest mb-2">{title}</h4>
            <p className={`text-4xl font-extrabold ${color}`}>{value}</p>
        </div>
    );
}

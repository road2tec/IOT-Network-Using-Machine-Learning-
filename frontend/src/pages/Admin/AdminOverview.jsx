import { useState, useEffect } from 'react';
import {
    UsersIcon,
    ShieldExclamationIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    SignalIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/api';
import { TrafficLineChart, AttackPieChart } from '../../components/Charts';

export default function AdminOverview() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        adminService.getStats().then(r => setStats(r.data)).catch(console.error);
    }, []);

    if (!stats) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-cyber-purple border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm font-mono uppercase tracking-widest">Loading Overview...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
                        Admin <span className="text-cyber-purple">Overview</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Full system health and summary at a glance.</p>
                </div>
                <div className="flex items-center gap-2 bg-cyber-purple/10 border border-cyber-purple/20 px-4 py-2 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-cyber-purple animate-pulse"></div>
                    <span className="text-xs font-bold text-cyber-purple uppercase tracking-widest">Master Admin Mode</span>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <StatCard label="Total Users" value={stats.totalUsers} icon={<UsersIcon className="w-6 h-6 text-cyber-cyan" />} color="text-cyber-cyan" />
                <StatCard label="Total Scans" value={stats.totalPredictions} icon={<SignalIcon className="w-6 h-6 text-gray-300" />} color="text-white" />
                <StatCard label="Attacks Found" value={stats.totalAttacks} icon={<ShieldExclamationIcon className="w-6 h-6 text-red-500" />} color="text-red-500" />
                <StatCard label="AI Accuracy" value={`${stats.accuracyRate}%`} icon={<ChartBarIcon className="w-6 h-6 text-green-400" />} color="text-green-400" />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Global Scan Activity</h3>
                        <span className="text-[10px] text-gray-600 font-mono uppercase">Last 24 Hours</span>
                    </div>
                    <div className="h-72">
                        <TrafficLineChart data={stats.timeline} />
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center">
                    <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest w-full text-left">Threat Ratio</h3>
                    <div className="w-full max-w-[240px] h-56">
                        <AttackPieChart
                            normal={stats.totalPredictions - stats.totalAttacks}
                            attack={stats.totalAttacks}
                        />
                    </div>
                    <div className="mt-6 pt-5 border-t border-white/5 w-full text-center">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">System Risk Level</p>
                        <p className={`text-2xl font-black ${stats.attackPercentage > 50 ? 'text-red-500' : 'text-cyber-cyan'}`}>
                            {stats.attackPercentage}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color, icon }) {
    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">{icon}</div>
                <ChevronRightIcon className="w-4 h-4 text-gray-700" />
            </div>
            <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">{label}</p>
        </div>
    );
}

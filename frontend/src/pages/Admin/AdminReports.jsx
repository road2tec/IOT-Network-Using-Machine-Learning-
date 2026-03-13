import { useState, useEffect } from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../services/api';
import { TrafficLineChart, AttackPieChart } from '../../components/Charts';

export default function AdminReports() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        adminService.getStats().then(r => setStats(r.data)).catch(console.error);
    }, []);

    if (!stats) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-cyber-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const healthScore = Math.max(0, 100 - stats.attackPercentage).toFixed(0);

    return (
        <div className="space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
                    System <span className="text-cyber-purple">Reports</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">Global analysis of all network detections.</p>
            </div>

            {/* Health Score */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Network Health Score</p>
                    <p className={`text-7xl font-black ${Number(healthScore) > 70 ? 'text-green-400' : 'text-red-500'}`}>{healthScore}%</p>
                    <p className="text-xs text-gray-500 mt-2">{Number(healthScore) > 70 ? 'System is Healthy' : 'High Risk Detected'}</p>
                </div>
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Total Scans</p>
                    <p className="text-7xl font-black text-white">{stats.totalPredictions}</p>
                    <p className="text-xs text-gray-500 mt-2">Across all users</p>
                </div>
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Attack Rate</p>
                    <p className={`text-7xl font-black ${stats.attackPercentage > 30 ? 'text-red-500' : 'text-cyber-cyan'}`}>{stats.attackPercentage}%</p>
                    <p className="text-xs text-gray-500 mt-2">Of total traffic</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Network Activity Trend</h3>
                    <div className="h-72">
                        <TrafficLineChart data={stats.timeline} />
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 w-full">Traffic Split</h3>
                    <div className="w-full max-w-[220px] h-52">
                        <AttackPieChart
                            normal={stats.totalPredictions - stats.totalAttacks}
                            attack={stats.totalAttacks}
                        />
                    </div>
                    <div className="mt-4 w-full space-y-2 pt-4 border-t border-white/5">
                        <LegendRow color="bg-cyber-cyan" label="Safe Traffic" value={stats.totalPredictions - stats.totalAttacks} />
                        <LegendRow color="bg-red-500" label="Attacks" value={stats.totalAttacks} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function LegendRow({ color, label, value }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-sm ${color}`}></div>
                <span className="text-xs text-gray-400">{label}</span>
            </div>
            <span className="text-xs font-bold text-white">{value}</span>
        </div>
    );
}

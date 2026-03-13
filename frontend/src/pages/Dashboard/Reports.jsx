import { useState, useEffect } from 'react';
import { 
    ShieldCheckIcon, 
    ShieldExclamationIcon, 
    SignalIcon,
    ChartBarIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';
import { predictionService } from '../../services/api';
import { AttackPieChart, TrafficLineChart } from '../../components/Charts';

export default function Reports() {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ total: 0, attacks: 0, normal: 0 });
    const [timelineData, setTimelineData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await predictionService.getHistory();
                const data = resp.data;
                setHistory(data);
                
                // Basic Stats
                const attacks = data.filter(h => h.prediction === 'Attack').length;
                const normal = data.length - attacks;
                setStats({ total: data.length, attacks, normal });

                // Process timeline (Grouping by hour)
                const timelineMap = {};
                data.forEach(item => {
                    const date = new Date(item.timestamp);
                    const hourStr = `${date.getHours()}:00`;
                    timelineMap[hourStr] = (timelineMap[hourStr] || 0) + 1;
                });

                const sortedTimeline = Object.entries(timelineMap)
                    .map(([date, count]) => ({ date, count }))
                    .slice(-10); // Show last 10 hours of activity
                
                setTimelineData(sortedTimeline);
            } catch (err) {
                console.error("Failed to load report data", err);
            }
        };
        fetchData();
    }, []);

    const healthScore = stats.total > 0 ? Math.round((stats.normal / stats.total) * 100) : 100;

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
                        <ChartBarIcon className="w-8 h-8 text-cyber-cyan" />
                        Network Reports
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">Deep analysis of your network activity and security status.</p>
                </div>
                
                <div className="glass-panel px-6 py-4 rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Health</p>
                        <p className="text-2xl font-black text-cyber-cyan">{healthScore}% Safe</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-xs ${healthScore > 80 ? 'border-cyber-cyan text-cyber-cyan' : 'border-red-500 text-red-500'}`}>
                        {healthScore}%
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard 
                    label="Total Scans" 
                    value={stats.total} 
                    icon={<SignalIcon className="w-6 h-6 text-gray-400" />} 
                    desc="Total network checks performed"
                />
                <MetricCard 
                    label="Danger Caught" 
                    value={stats.attacks} 
                    icon={<ShieldExclamationIcon className="w-6 h-6 text-red-500" />} 
                    desc="Blocked malicious attempts"
                    color="text-red-500"
                />
                <MetricCard 
                    label="Safe Activity" 
                    value={stats.normal} 
                    icon={<ShieldCheckIcon className="w-6 h-6 text-green-500" />} 
                    desc="Verified secure traffic"
                    color="text-green-500"
                />
            </div>

            {/* Main Analysis Sections */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Timeline Chart */}
                <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Network Usage Trend</h2>
                            <p className="text-xs text-gray-500 mt-1">Activity recorded over the last few hours.</p>
                        </div>
                        <InformationCircleIcon className="w-5 h-5 text-gray-600 cursor-help" title="Shows the volume of scans performed by the system." />
                    </div>
                    <div className="h-72">
                        <TrafficLineChart data={timelineData} />
                    </div>
                    <p className="mt-6 text-[10px] text-gray-500 italic uppercase tracking-tighter">
                        Note: Higher peaks indicate busier network periods.
                    </p>
                </div>

                {/* Pie Chart */}
                <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center">
                    <div className="w-full text-left mb-8">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Safety Distribution</h2>
                        <p className="text-xs text-gray-500 mt-1">Percentage of safe vs. risky traffic.</p>
                    </div>
                    <div className="w-full max-w-sm h-72">
                        <AttackPieChart normal={stats.normal} attack={stats.attacks} />
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
                        <div className="text-center p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                            <p className="text-[10px] text-red-500 font-bold uppercase">Risky</p>
                            <p className="text-xl font-black text-red-500">{stats.total > 0 ? ((stats.attacks/stats.total)*100).toFixed(1) : 0}%</p>
                        </div>
                        <div className="text-center p-3 bg-green-500/5 rounded-xl border border-green-500/10">
                            <p className="text-[10px] text-green-500 font-bold uppercase">Safe</p>
                            <p className="text-xl font-black text-green-500">{stats.total > 0 ? ((stats.normal/stats.total)*100).toFixed(1) : 0}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simple User Guidance */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-cyber-cyan/5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <InformationCircleIcon className="w-6 h-6 text-cyber-cyan" />
                    How to read these reports?
                </h3>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-400 leading-relaxed">
                    <p>
                        The <span className="text-white font-bold">Trend graph</span> helps you see when your network is most active. If you see high activity at odd hours, it might be worth investigating.
                    </p>
                    <p>
                        The <span className="text-white font-bold">Safety Score</span> at the top summarizes your overall status. A score above 90% is excellent, while a score below 70% suggests you should check the "Threats" section.
                    </p>
                </div>
            </div>
        </div>
    );
}

const MetricCard = ({ label, value, icon, desc, color = "text-white" }) => (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl hover:translate-y-[-4px] transition-transform duration-300">
        <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/5 p-3 rounded-xl">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
                <p className={`text-3xl font-black ${color}`}>{value}</p>
            </div>
        </div>
        <p className="text-xs text-gray-500">{desc}</p>
    </div>
);

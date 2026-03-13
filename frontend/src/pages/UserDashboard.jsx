import { useState, useEffect } from 'react';
import { 
    ClockIcon, 
    ShieldExclamationIcon, 
    ShieldCheckIcon,
    ChartPieIcon,
    ArrowTrendingUpIcon,
    LightBulbIcon,
    MagnifyingGlassIcon,
    CpuChipIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { predictionService } from '../services/api';
import { AttackPieChart } from '../components/Charts';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ total: 0, attacks: 0, normal: 0 });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const resp = await predictionService.getHistory();
                const data = resp.data;
                setHistory(data);
                const attacks = data.filter(h => h.prediction === 'Attack').length;
                setStats({ total: data.length, attacks, normal: data.length - attacks });
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
                        System <span className="text-cyber-cyan">Overview</span>
                    </h1>
                    <p className="text-gray-500 text-xs font-mono mt-1">ALL SYSTEMS OPERATING NORMALLY</p>
                </div>
                <Link to="/dashboard/analyze" className="px-6 py-3 bg-cyber-cyan text-black text-sm font-bold rounded-xl hover:brightness-110 transition-all">
                    + New Scan
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Checks" value={stats.total} icon={<ArrowTrendingUpIcon className="w-5 h-5" />} color="text-white" />
                <StatCard label="Threats Found" value={stats.attacks} icon={<ShieldExclamationIcon className="w-5 h-5 text-red-500" />} color="text-red-500" />
                <StatCard label="Safe Traffic" value={stats.normal} icon={<ShieldCheckIcon className="w-5 h-5 text-cyber-cyan" />} color="text-cyber-cyan" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Traffic Chart */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 shadow-xl">
                    <h2 className="text-sm font-bold text-gray-400 mb-8 uppercase tracking-widest flex items-center gap-2">
                        <ChartPieIcon className="w-5 h-5 text-cyber-cyan" />
                        Traffic Report
                    </h2>
                    <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                        <div className="w-full max-w-[280px]">
                            <AttackPieChart normal={stats.normal} attack={stats.attacks} />
                        </div>
                        <div className="space-y-4 w-full">
                            <SummaryBox label="Threat Ratio" value={`${((stats.attacks / (stats.total || 1)) * 100).toFixed(1)}%`} sub="Percentage of attacks detected" />
                            <SummaryBox label="Protection Status" value="ACTIVE" sub="All filters are running" color="text-green-500" />
                            <Link to="/dashboard/analyze" className="block w-full py-4 bg-cyber-cyan text-black text-center font-bold rounded-xl mt-4 hover:brightness-110 transition-all">
                                Start New Analysis
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent History */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-xl overflow-hidden">
                    <h2 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-cyber-cyan" />
                        Last Checks
                    </h2>
                    <div className="space-y-3">
                        {history.length === 0 && (
                            <p className="text-gray-600 text-xs text-center py-6">No checks yet. Upload a file to start.</p>
                        )}
                        {history.slice(0, 8).map(log => (
                            <div key={log.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                    <div className="text-xs font-mono text-gray-400">Scan #{log.id}</div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${log.prediction === 'Attack' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-green-500/20 text-green-400 border border-green-500/20'}`}>
                                    {log.prediction === 'Attack' ? '⚠ THREAT' : '✓ SAFE'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Explainable AI Section ─────────────────────────────── */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <LightBulbIcon className="w-7 h-7 text-yellow-400" />
                    <div>
                        <h2 className="text-xl font-black text-white">How does the AI make decisions?</h2>
                        <p className="text-gray-500 text-sm">A simple explanation of how this system works behind the scenes.</p>
                    </div>
                </div>

                {/* Step-by-step flow */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <XAICard
                        step="Step 1"
                        icon={<MagnifyingGlassIcon className="w-7 h-7 text-cyber-cyan" />}
                        title="Data is Collected"
                        desc="The system looks at your network traffic — things like: How fast is data moving? Where is it going? How many packets were sent? This raw information is the AI's input."
                        color="border-cyber-cyan/30 bg-cyber-cyan/5"
                    />
                    <XAICard
                        step="Step 2"
                        icon={<CpuChipIcon className="w-7 h-7 text-purple-400" />}
                        title="AI Analyses the Pattern"
                        desc="A trained AI model (XGBoost) looks at the pattern of this data. It has already learned what 'normal' traffic looks like and what 'dangerous' traffic looks like from millions of past examples."
                        color="border-purple-500/30 bg-purple-500/5"
                    />
                    <XAICard
                        step="Step 3"
                        icon={<ChartBarIcon className="w-7 h-7 text-yellow-400" />}
                        title="Result + Reason is Given"
                        desc='The system gives you a verdict — "Normal" or "Attack". But it also explains WHY using a bar chart. Each bar represents one clue the AI used to make that decision. This is called Explainable AI (XAI).'
                        color="border-yellow-500/30 bg-yellow-500/5"
                    />
                </div>

                {/* What is SHAP */}
                <div className="glass-panel p-8 rounded-3xl border border-cyber-cyan/10 bg-cyber-cyan/3">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-cyber-cyan mb-3 flex items-center gap-2">
                                <LightBulbIcon className="w-5 h-5" />
                                What is "Explainable AI"?
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Normally, an AI is like a black box — it gives you an answer but doesn't tell you why. Our system uses a technique called <span className="text-white font-bold">SHAP (Explainability Analysis)</span> to open that black box.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Think of it like a judge in a court. The judge doesn't just say "Guilty" — they explain the evidence. SHAP works the same way. It tells you which specific clues in the network traffic caused the AI to suspect an attack.
                            </p>
                        </div>
                        <div className="flex-1 space-y-3">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">How to read the decision chart:</h3>
                            <LegendItem color="bg-red-500" label="Red bars = Suspicious clues" desc="These are signals that made the AI think there is danger (e.g. unusually high data speed)" />
                            <LegendItem color="bg-cyan-400" label="Cyan bars = Safe clues" desc="These are signals that made the AI think the traffic is normal and secure" />
                            <LegendItem color="bg-gray-400" label="Longer bar = More important" desc="The longer the bar, the more that clue influenced the final decision" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, color, icon }) => (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-xl flex items-center gap-6">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">{icon}</div>
        <div>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</div>
        </div>
    </div>
);

const SummaryBox = ({ label, value, sub, color = "text-white" }) => (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
        <div className="text-xs text-gray-500 uppercase font-bold">{label}</div>
        <div className={`text-xl font-black ${color}`}>{value}</div>
        <div className="text-[10px] text-gray-400 mt-1">{sub}</div>
    </div>
);

const XAICard = ({ step, icon, title, desc, color }) => (
    <div className={`glass-panel p-6 rounded-2xl border ${color} space-y-3`}>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{step}</div>
        <div>{icon}</div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

const LegendItem = ({ color, label, desc }) => (
    <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-sm mt-1 flex-shrink-0 ${color}`}></div>
        <div>
            <p className="text-sm font-bold text-white">{label}</p>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
    </div>
);

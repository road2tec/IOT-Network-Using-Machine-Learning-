import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, ShieldExclamationIcon, SignalIcon, PauseIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';

const LiveMonitor = () => {
    const [packets, setPackets] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [stats, setStats] = useState({ total: 0, attacks: 0, normal: 0 });
    const ws = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        connect();
        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    useEffect(() => {
        if (!isPaused && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [packets, isPaused]);

    const connect = () => {
        const socketUrl = 'ws://localhost:8000/api/live/ws';
        ws.current = new WebSocket(socketUrl);

        ws.current.onopen = () => setIsConnected(true);
        ws.current.onclose = () => setIsConnected(false);
        ws.current.onmessage = (event) => {
            if (isPaused) return;

            const data = JSON.parse(event.data);
            if (data.error) return;

            setPackets(prev => {
                const newPackets = [...prev, data];
                return newPackets.slice(-50); // Keep last 50
            });

            setStats(prev => ({
                total: prev.total + 1,
                attacks: data.result === 'Attack' ? prev.attacks + 1 : prev.attacks,
                normal: data.result === 'Normal' ? prev.normal + 1 : prev.normal
            }));
        };
    };

    const clearConsole = () => setPackets([]);

    return (
        <div className="p-6 max-w-7xl mx-auto pt-4 min-h-screen">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    label="Status" 
                    value={isConnected ? "CONNECTED" : "DISCONNECTED"} 
                    color={isConnected ? "text-cyber-cyan" : "text-red-500"} 
                    icon={<SignalIcon className="w-6 h-6" />}
                />
                <StatCard 
                    label="Total Packets" 
                    value={stats.total} 
                    color="text-white" 
                    icon={<ShieldCheckIcon className="w-6 h-6 text-gray-400" />}
                />
                <StatCard 
                    label="Normal Traffic" 
                    value={stats.normal} 
                    color="text-cyber-cyan" 
                    icon={<ShieldCheckIcon className="w-6 h-6 text-cyber-cyan" />}
                />
                <StatCard 
                    label="Attacks Detected" 
                    value={stats.attacks} 
                    color="text-red-500" 
                    icon={<ShieldExclamationIcon className="w-6 h-6 text-red-500" />}
                />
            </div>

            {/* Protocol Decoder Guide */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-blue-500/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-xs font-black text-blue-400 uppercase tracking-widest">TCP (Trusted)</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">Most web browsing and emails use this. It's safe and checks if data arrives correctly.</p>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-purple-500/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        <span className="text-xs font-black text-purple-400 uppercase tracking-widest">UDP (Streaming)</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">Used for video calls and games. It's much faster because it doesn't wait to re-send lost data.</p>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-cyber-cyan/5">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-cyber-cyan"></div>
                        <span className="text-xs font-black text-cyber-cyan uppercase tracking-widest">OTHER (Admin)</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">Signal data like DNS (finding websites) or ICMP (pings) used by the network itself.</p>
                </div>
            </div>

            {/* Live Terminal */}
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[600px] shadow-2xl relative">
                {/* Terminal Header */}
                <div className="bg-slate-900/80 p-4 border-b border-white/10 flex justify-between items-center bg-dot-grid">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest ml-4">Live Traffic Analyzer v1.0.4</span>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsPaused(!isPaused)}
                            className={`p-2 rounded-lg transition-colors ${isPaused ? 'bg-cyber-purple text-white' : 'hover:bg-white/5 text-gray-400'}`}
                            title={isPaused ? "Resume" : "Pause"}
                        >
                            {isPaused ? <PlayIcon className="w-5 h-5" /> : <PauseIcon className="w-5 h-5" />}
                        </button>
                        <button 
                            onClick={clearConsole}
                            className="p-2 hover:bg-white/5 text-gray-400 rounded-lg transition-colors"
                            title="Clear Console"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Console Log Area */}
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 bg-black/40"
                >
                    <AnimatePresence mode="popLayout">
                        {packets.map((pkt) => (
                            <motion.div 
                                key={pkt.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex items-center gap-4 py-1.5 px-3 rounded-md transition-all ${pkt.result === 'Attack' ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 animate-pulse' : 'text-gray-300 hover:bg-white/5'}`}
                            >
                                <span className="text-gray-600 min-w-[80px] text-[10px]">{pkt.timestamp}</span>
                                <span className="min-w-[50px] font-bold text-cyber-cyan">{pkt.proto}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded border leading-none ${pkt.state === 'LIVE' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400 opacity-60'}`}>
                                    {pkt.state}
                                </span>
                                <span className="min-w-[80px] opacity-70">{pkt.service}</span>
                                <span className="hidden md:inline min-w-[100px] text-xs">S:{pkt.sbytes} | D:{pkt.dbytes}</span>
                                <span className={`font-black uppercase tracking-tighter ml-auto ${pkt.result === 'Attack' ? 'text-red-500' : 'text-cyber-cyan'}`}>
                                    [{pkt.result}]
                                </span>
                                <span className="min-w-[60px] text-right font-bold">{pkt.confidence}%</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {packets.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4 mt-20">
                            <SignalIcon className="w-12 h-12 animate-pulse" />
                            <p>WAITING FOR NETWORK DATA STREAM...</p>
                        </div>
                    )}
                </div>

                {/* Bottom Status Bar */}
                <div className="bg-slate-900/60 p-2 px-4 border-t border-white/5 flex justify-between text-[10px] font-mono text-gray-500">
                    <div>LOCATION: IDS_NODE_01_MAH</div>
                    <div className="flex gap-4">
                        <span>CPU: 12%</span>
                        <span>LATENCY: 42ms</span>
                        <span className={isConnected ? "text-cyber-cyan" : "text-red-500"}>{isConnected ? "DATA_STREAM_OK" : "CONNECTION_ERR"}</span>
                    </div>
                </div>
            </div>

            {/* Alert Banner for Attacks */}
            <AnimatePresence>
                {packets.length > 0 && packets[packets.length - 1].result === 'Attack' && !isPaused && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 bg-red-600 text-white p-6 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.5)] z-50 flex items-center gap-6 border-2 border-red-400"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-ping">
                            <ShieldExclamationIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black tracking-tighter">THREAT DETECTED!</h4>
                            <p className="text-sm opacity-90">Anomaly identified in real-time stream. Protocol: {packets[packets.length - 1].proto}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ label, value, color, icon }) => (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
            {icon}
        </div>
        <div className={`text-2xl font-black ${color}`}>{value}</div>
    </div>
);

export default LiveMonitor;

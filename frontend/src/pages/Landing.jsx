import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    BoltIcon,
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    CpuChipIcon,
    ArrowTrendingUpIcon,
    GlobeAltIcon,
    PresentationChartBarIcon,
    RocketLaunchIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Landing() {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <div className="flex flex-col w-full selection:bg-cyber-cyan selection:text-slate-900">
            {/* Hero Section */}
            <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-cyber-cyan/10 blur-[120px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-cyber-purple/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <motion.div
                    style={{ opacity, scale }}
                    className="max-w-6xl w-full text-center z-10"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
                        </span>
                        <span className="text-xs font-bold tracking-widest text-cyber-cyan uppercase">v2.0 Now Live • XGBoost Optimized</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1]">
                        Explainable
                        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-white to-cyber-purple drop-shadow-[0_0_15px_rgba(0,245,212,0.3)]">
                            Intrusion Defense
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Secure your IoT networks with state-of-the-art XGBoost classification powered by real-time <span className="text-white font-semibold">SHAP explainability</span> for mission-critical clarity.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8 relative z-20">
                        <Link to="/register" className="group relative px-10 py-5 bg-cyber-cyan text-slate-900 font-black rounded-2xl hover:bg-white transition-all overflow-hidden shadow-[0_0_30px_rgba(0,245,212,0.3)]">
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                            <span className="relative flex items-center gap-2">
                                START SECURING <RocketLaunchIcon className="w-5 h-5" />
                            </span>
                        </Link>
                        <Link to="/login" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:border-cyber-cyan/50 hover:bg-white/10 transition-all backdrop-blur-sm">
                            ACCESS TERMINAL
                        </Link>
                    </div>

                    {/* Futuristic Data Stream Animation */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="mt-24 relative mx-auto w-full max-w-5xl h-[500px] border border-white/5 rounded-[2.5rem] overflow-hidden glass-panel flex items-center justify-center shadow-2xl"
                    >
                        {/* Background grid/dots */}
                        <div className="absolute inset-0 bg-dot-grid opacity-30"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,212,0.1)_0,transparent_70%)]"></div>

                        {/* Abstract Network Interface */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Scanning Laser */}
                            <motion.div
                                animate={{ y: ['-250%', '250%'] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="absolute w-[150%] h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-[0_0_25px_#00F5D4] z-20 rotate-6 opacity-40"
                            />

                            {/* Center Security Core */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.02, 1],
                                    boxShadow: ['0 0 50px rgba(0,245,212,0.1)', '0 0 80px rgba(124,58,237,0.2)', '0 0 50px rgba(0,245,212,0.1)']
                                }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                className="absolute w-72 h-72 rounded-[3rem] border border-white/10 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center z-10"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                                    className="absolute inset-4 rounded-[2.5rem] border border-dashed border-cyber-purple/40"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
                                    className="absolute inset-8 rounded-[2rem] border border-dashed border-cyber-cyan/30"
                                />
                                <div className="text-center font-mono">
                                    <div className="text-xs text-cyber-cyan mb-2 tracking-[0.3em] font-bold">SYSTEM CORE</div>
                                    <div className="text-4xl text-white font-black tracking-widest flex items-center gap-1">
                                        XAI<span className="text-cyber-purple">ID</span>S
                                    </div>
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="text-[10px] text-gray-500 mt-4 tracking-widest uppercase"
                                    >
                                        Analyzing Traffic...
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Floating Packets / Orbs */}
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, Math.random() * 80 - 40, 0],
                                        x: [0, Math.random() * 80 - 40, 0],
                                        opacity: [0.1, 0.6, 0.1]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 4 + Math.random() * 4,
                                        delay: Math.random() * 2
                                    }}
                                    className={`absolute w-${i % 2 === 0 ? '3' : '2'} h-${i % 2 === 0 ? '3' : '2'} rounded-full ${i % 3 === 0 ? 'bg-cyber-cyan shadow-[0_0_15px_#00F5D4]' : 'bg-cyber-purple shadow-[0_0_15px_#7C3AED]'}`}
                                    style={{
                                        top: `${20 + Math.random() * 60}%`,
                                        left: `${20 + Math.random() * 60}%`
                                    }}
                                />
                            ))}
                        </div>
                        {/* Bottom fade overlap */}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Live Preview Section */}
            <section className="py-32 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/5">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Real-time Watch</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
                                Live Network 
                                <br />
                                <span className="text-cyber-cyan">Monitoring</span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                Don't just detect — observe. Our dashboard provides a millisecond-accurate stream of every packet entering your IoT ecosystem, instantly analyzed by AI.
                            </p>
                            <div className="flex flex-col gap-4">
                                <LiveFeature text="Instant Threat Flagging" />
                                <LiveFeature text="Protocol Decomposition (TCP/UDP)" />
                                <LiveFeature text="98%+ Prediction Confidence" />
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-2xl">
                            {/* Simulated Live Terminal */}
                            <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl shadow-cyber-cyan/10">
                                <div className="bg-slate-900 p-4 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Incoming Traffic Stream</div>
                                </div>
                                <div className="p-6 bg-black/40 font-mono text-[11px] h-[350px] overflow-hidden relative">
                                    <div className="space-y-3">
                                        <SimulatedRow time="16:01:22" type="TCP" color="text-blue-400" label="S:443 | D:1024" status="NORMAL" />
                                        <SimulatedRow time="16:01:23" type="UDP" color="text-purple-400" label="S:53 | D:56781" status="NORMAL" />
                                        <SimulatedRow time="16:01:25" type="TCP" color="text-blue-400" label="S:80 | D:255" status="ATTACK" highlight />
                                        <SimulatedRow time="16:01:26" type="OTHER" color="text-cyber-cyan" label="S:0 | D:0" status="NORMAL" />
                                        <SimulatedRow time="16:01:28" type="TCP" color="text-blue-400" label="S:443 | D:1024" status="NORMAL" />
                                        <SimulatedRow time="16:01:29" type="UDP" color="text-red-400" label="S:8080 | D:80" status="ATTACK" highlight />
                                        <SimulatedRow time="16:01:30" type="TCP" color="text-blue-400" label="S:22 | D:123" status="NORMAL" />
                                        <SimulatedRow time="16:01:31" type="OTHER" color="text-cyber-cyan" label="ICMP_REQUEST" status="NORMAL" />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950 to-transparent"></div>
                                </div>
                                <div className="p-4 bg-slate-900/50 text-center">
                                    <Link to="/register" className="text-[10px] font-bold text-cyber-cyan uppercase tracking-[0.2em] hover:text-white transition-colors">
                                        Unlock Full Dashboard →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats/Metrics Section */}
            <div className="py-20 bg-slate-950 border-y border-white/5">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatItem label="Attack Types Detected" value="9+" icon={<ShieldCheckIcon className="w-5 h-5 text-cyber-cyan" />} />
                    <StatItem label="Detection Accuracy" value="98.2%" icon={<ArrowTrendingUpIcon className="w-5 h-5 text-cyber-purple" />} />
                    <StatItem label="Processing Latency" value="< 2ms" icon={<BoltIcon className="w-5 h-5 text-cyber-cyan" />} />
                    <StatItem label="XAI Feature Depth" value="40+" icon={<CpuChipIcon className="w-5 h-5 text-cyber-purple" />} />
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-32 px-4 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-sm font-black text-cyber-cyan tracking-[0.4em] uppercase mb-4">Core Capabilities</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-white">Engineered for Security</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="XGBoost Classifier"
                            desc="Optimized for high-velocity network streams with sub-millisecond classification response times."
                            icon={<BoltIcon />}
                            color="cyan"
                        />
                        <FeatureCard
                            title="SHAP Explainability"
                            desc="Real-time feature attribution reveals precisely why traffic was flagged, eliminating false positive fatigue."
                            icon={<MagnifyingGlassIcon />}
                            color="purple"
                        />
                        <FeatureCard
                            title="Admin Intelligence"
                            desc="Comprehensive dashboard for global visibility into attack patterns, geolocation, and threat trends."
                            icon={<PresentationChartBarIcon />}
                            color="white"
                        />
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div id="how-it-works" className="py-32 px-4 bg-white/[0.02] border-y border-white/5 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-4 text-center md:text-left">
                        <div>
                            <h2 className="text-sm font-black text-cyber-purple tracking-[0.4em] uppercase mb-4">The Pipeline</h2>
                            <h3 className="text-4xl md:text-5xl font-extrabold text-white">Intelligence Workflow</h3>
                        </div>
                        <p className="text-slate-400 max-w-sm mb-2">A seamless transition from raw packet capture to actionable, explained security alerts.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <StepCard
                            number="01"
                            title="Traffic Capture"
                            desc="Real-time ingestion of network flow data through high-performance ingestion nodes."
                            icon={<GlobeAltIcon className="w-6 h-6" />}
                        />
                        <StepCard
                            number="02"
                            title="AI Inference"
                            desc="Native XGBoost models classify patterns into 9 distinct attack categories or benign traffic."
                            icon={<CpuChipIcon className="w-6 h-6" />}
                        />
                        <StepCard
                            number="03"
                            title="SHAP Computation"
                            desc="Deep mathematical analysis of feature contributions for every single detection event."
                            icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
                        />
                        <StepCard
                            number="04"
                            title="Explained Insight"
                            desc="Instant visualization of threat factors through local force plots and global statistics."
                            icon={<PresentationChartBarIcon className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div id="about" className="py-32 px-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
                    <div className="absolute top-1/2 left-[20%] w-[40%] h-[40%] bg-cyber-cyan/5 blur-[100px] rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-3xl mx-auto mb-10 flex items-center justify-center shadow-2xl rotate-12">
                        <ShieldCheckIcon className="w-10 h-10 text-slate-900" />
                    </div>

                    <h2 className="text-4xl font-extrabold mb-8 text-white">Trust, but <span className="text-cyber-cyan italic underline underline-offset-8 decoration-cyber-cyan/30">Explain</span>.</h2>
                    <p className="text-xl text-slate-400 mb-10 leading-relaxed italic">
                        "The goal is not just an accurate model, but a model that can be trusted by security professionals who need to know 'Why'."
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <TechBadge name="React" />
                        <TechBadge name="FastAPI" />
                        <TechBadge name="XGBoost" />
                        <TechBadge name="SHAP" />
                        <TechBadge name="MongoDB" />
                        <TechBadge name="Tailwind" />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-32 px-4 pb-48">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="max-w-5xl mx-auto glass-panel p-12 md:p-20 rounded-[3rem] text-center border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/10 to-cyber-purple/10 opacity-50"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to deploy?</h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                            Join the next generation of cybersecurity where AI and human intelligence work in tandem.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="px-12 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-cyber-cyan transition-all shadow-xl">
                                GET STARTED NOW
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-slate-950 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyber-cyan rounded flex items-center justify-center">
                            <ShieldCheckIcon className="w-5 h-5 text-slate-900" />
                        </div>
                        <div className="text-2xl font-black tracking-tighter">
                            IDS<span className="text-cyber-cyan italic">.</span>XAI
                        </div>
                    </div>

                    <div className="flex gap-10">
                        <a href="#features" className="text-slate-500 hover:text-cyber-cyan transition-colors text-sm font-bold uppercase tracking-widest">Features</a>
                        <a href="#how-it-works" className="text-slate-500 hover:text-cyber-cyan transition-colors text-sm font-bold uppercase tracking-widest">Workflow</a>
                        <a href="#about" className="text-slate-500 hover:text-cyber-cyan transition-colors text-sm font-bold uppercase tracking-widest">About</a>
                    </div>

                    <div className="text-slate-600 text-xs font-mono uppercase tracking-widest">
                        © {new Date().getFullYear()} CORE_OS // System Terminal
                    </div>
                </div>
            </footer>
        </div>
    );
}

function StatItem({ label, value, icon }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="mb-3 p-2 bg-white/5 rounded-lg border border-white/5">
                {icon}
            </div>
            <div className="text-3xl font-black text-white mb-1 uppercase tracking-tighter">{value}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
        </div>
    );
}

function TechBadge({ name }) {
    return (
        <span className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-bold hover:border-cyber-cyan/50 hover:text-white transition-all cursor-default">
            {name}
        </span>
    );
}

function FeatureCard({ title, desc, icon, color }) {
    const colorClasses = {
        cyan: "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/20",
        purple: "bg-cyber-purple/10 text-cyber-purple border-cyber-purple/20",
        white: "bg-white/10 text-white border-white/20"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, borderColor: 'rgba(255,255,255,0.2)' }}
            className="group glass-panel p-10 rounded-[2.5rem] border border-white/5 transition-all h-full flex flex-col"
        >
            <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center border ${colorClasses[color]}`}>
                {icon && <div className="w-7 h-7">{icon}</div>}
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-cyber-cyan transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{desc}</p>
        </motion.div>
    );
}

function StepCard({ number, title, desc, icon }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group flex flex-col md:flex-row items-center md:items-start gap-8 glass-panel p-8 rounded-[2rem] border border-white/5 hover:bg-white/[0.04] transition-all"
        >
            <div className="relative shrink-0">
                <div className="text-5xl font-black text-white/5 select-none absolute -top-4 -left-4">
                    {number}
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border border-white/10 relative z-10 group-hover:border-cyber-purple/50 transition-colors shadow-xl">
                    <div className="text-cyber-purple">
                        {icon}
                    </div>
                </div>
            </div>
            <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
}

function LiveFeature({ text }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-cyber-cyan/20 flex items-center justify-center border border-cyber-cyan/30">
                <CheckCircleIcon className="w-3 h-3 text-cyber-cyan" />
            </div>
            <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">{text}</span>
        </div>
    );
}

function SimulatedRow({ time, type, color, label, status, highlight }) {
    return (
        <div className={`flex items-center justify-between p-2 rounded-lg border ${highlight ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/5 text-gray-400'} transition-all`}>
            <div className="flex items-center gap-4">
                <span className="text-[9px] opacity-40 font-mono">{time}</span>
                <span className={`text-[10px] font-black ${color} w-10 text-center`}>{type}</span>
                <span className="text-[10px] opacity-60">{label}</span>
            </div>
            <div className={`text-[9px] font-black px-2 py-0.5 rounded ${status === 'ATTACK' ? 'bg-red-500/20' : 'bg-green-500/20 text-green-400'}`}>
                [{status}]
            </div>
        </div>
    );
}

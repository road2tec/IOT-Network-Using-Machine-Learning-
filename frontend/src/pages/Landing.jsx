import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Landing() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <div id="home" className="flex flex-col items-center justify-center pt-32 pb-8 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl w-full"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyber-cyan via-blue-400 to-cyber-purple">
                        Explainable & Intelligent
                        <br />
                        Intrusion Detection
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
                        Secure your IoT networks with state-of-the-art XGBoost classification powered by real-time SHAP explainability.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 relative z-20">
                        <Link to="/register" className="px-8 py-4 bg-cyber-cyan text-slate-900 font-bold rounded-lg hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(0,245,212,0.4)] hover:shadow-[0_0_30px_rgba(0,245,212,0.8)]">
                            Start Securing Now
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-transparent border border-gray-600 text-gray-300 font-bold rounded-lg hover:border-cyber-cyan hover:text-cyber-cyan transition-all">
                            Access Dashboard
                        </Link>
                    </div>

                    {/* Futuristic Data Stream Animation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="mt-20 relative mx-auto w-full max-w-5xl h-[400px] border border-cyber-cyan/20 rounded-2xl overflow-hidden glass-panel flex items-center justify-center p-8"
                    >
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,212,0.1)_0,transparent_70%)]"></div>

                        {/* Abstract Network Interface */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Scanning Laser */}
                            <motion.div
                                animate={{ y: ['-200%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="absolute w-[150%] h-1 bg-cyber-cyan shadow-[0_0_20px_#00F5D4] z-20 rotate-12 opacity-50"
                            />

                            {/* Center Security Core */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1], borderColor: ['rgba(0,245,212,0.2)', 'rgba(0,245,212,0.8)', 'rgba(0,245,212,0.2)'] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute w-64 h-64 rounded-full border border-cyber-cyan/40 bg-cyber-bg shadow-[0_0_50px_rgba(0,245,212,0.1)] flex items-center justify-center z-10"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    className="absolute w-56 h-56 rounded-full border-t-2 border-r-2 border-dashed border-cyber-purple/60"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                                    className="absolute w-48 h-48 rounded-full border-b-2 border-l-2 border-dashed border-cyber-cyan/60"
                                />
                                <div className="text-center font-mono">
                                    <div className="text-3xl text-white font-bold tracking-widest">XAI<span className="text-cyber-cyan">.</span>CORE</div>
                                    <div className="text-xs text-cyber-purple mt-2 tracking-widest uppercase opacity-80">Monitoring</div>
                                </div>
                            </motion.div>

                            {/* Floating Packets / Orbs */}
                            <motion.div
                                animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.3, 0.8, 0.3] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-cyber-purple shadow-[0_0_15px_#7C3AED]"
                            />
                            <motion.div
                                animate={{ y: [0, 40, 0], x: [0, -20, 0], opacity: [0.4, 0.9, 0.4] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-1/4 right-1/4 w-3 h-3 rounded-full bg-cyber-cyan shadow-[0_0_15px_#00F5D4]"
                            />

                            {/* Network Connections */}
                            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                                <motion.path
                                    d="M 200,100 L 400,200 L 600,100"
                                    fill="transparent"
                                    stroke="#00F5D4"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                />
                                <motion.path
                                    d="M 300,300 L 400,200 L 500,300"
                                    fill="transparent"
                                    stroke="#7C3AED"
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 1 }}
                                />
                            </svg>
                        </div>
                        {/* Bottom fade overlap */}
                        <div className="absolute inset-0 bg-gradient-to-t from-cyber-bg to-transparent z-10 bottom-0 top-[80%]"></div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 px-4 bg-cyber-card/30">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-16 text-white"><span className="text-cyber-cyan">Key</span> Features</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <FeatureCard
                            title="XGBoost Classifier"
                            desc="Trained on UNSW-NB15 dataset achieving 90%+ diagnostic accuracy on modern network traffic."
                            icon="⚡"
                        />
                        <FeatureCard
                            title="Explainable AI (SHAP)"
                            desc="Don't just trust black-box alerts. View interactive local force plots and global feature distributions."
                            icon="🔍"
                        />
                        <FeatureCard
                            title="Role Based Insights"
                            desc="Decoupled User inference UI and global Admin dashboard statistics on network analytics."
                            icon="🛡️"
                        />
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div id="how-it-works" className="py-24 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-bold mb-16 text-center text-white"><span className="text-cyber-purple">How</span> It Works</h2>
                    <div className="space-y-12">
                        <StepCard
                            number="01"
                            title="Data Collection & Input"
                            desc="Network flow data is captured and input into the system in real-time or via manual CSV upload."
                        />
                        <StepCard
                            number="02"
                            title="AI Inference Pipeline"
                            desc="The XGBoost model, optimized for high precision and recall, classifies the traffic as Benign or malicious (e.g., DoS, Fuzzers, Exploits)."
                        />
                        <StepCard
                            number="03"
                            title="SHAP Explainability"
                            desc="Alongside the prediction, SHAP values are computed to identify the top network features (like TTL or bytes transferred) that influenced the AI’s decision."
                        />
                        <StepCard
                            number="04"
                            title="Analytics Dashboard"
                            desc="Interactive charts are rendered for administrators to analyze overall network health and specific intrusion alerts."
                        />
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div id="about" className="py-24 px-4 bg-cyber-card/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8 text-white"><span className="text-cyber-cyan">About</span> The System</h2>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        This Explanable Intrusion Detection System is built as part of an advanced cybersecurity project aimed at demystifying AI decisions in critical infrastructure. We combine the predictive power of machine learning with transparent insights through SHAP (SHapley Additive exPlanations).
                    </p>
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                        The web application utilizes a modern tech stack featuring React, FastAPI, Python, and securely stores user data utilizing <strong>MongoDB Compass</strong>. By prioritizing Explainable AI (XAI), we ensure that network administrators are never left guessing why a specific packet was flagged as an attack.
                    </p>
                    <div className="inline-block mt-4 glass-panel px-6 py-3 rounded-xl border border-cyber-purple/50">
                        <span className="font-semibold text-cyber-purple">Powered by MongoDB Compass</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-8 border-t border-gray-800 bg-cyber-bg text-center">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-2xl font-bold tracking-tighter">
                        <span className="text-cyber-cyan">IDS</span><span className="text-white">_XAI</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} IDS XAI System. All Rights Reserved.
                    </div>
                    <div className="flex gap-4">
                        <a href="#features" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">Features</a>
                        <a href="#how-it-works" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">How it Works</a>
                        <a href="#about" className="text-gray-400 hover:text-cyber-cyan transition-colors text-sm">About</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ title, desc, icon }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="glass-panel p-8 rounded-2xl hover:border-cyber-cyan/50 transition-colors h-full"
        >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{desc}</p>
        </motion.div>
    );
}

function StepCard({ number, title, desc }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6 glass-panel p-6 rounded-2xl border-l-4 border-l-cyber-purple hover:border-l-cyber-cyan transition-colors"
        >
            <div className="text-5xl font-extrabold text-cyber-purple/20 md:w-24 shrink-0">
                {number}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400">{desc}</p>
            </div>
        </motion.div>
    );
}

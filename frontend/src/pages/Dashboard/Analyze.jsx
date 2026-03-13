import { useState } from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { predictionService } from '../../services/api';
import { FeatureBarChart } from '../../components/Charts';

export default function Analyze() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        setError('');
        try {
            const resp = await predictionService.uploadCSV(file);
            setResult(resp.data);
        } catch (err) {
            setError("Analysis failed. Please check your file.");
        } finally {
            setLoading(false);
        }
    };

    let shapLabels = [], shapVals = [];
    if (result?.shap_values) {
        const featureNames = ["Data Size", "Speed", "Time Limit", "Protocol Info", "Packet Count", "Byte Rate"];
        shapLabels = result.shap_values.map((v, i) => featureNames[i] || `Feature ${i}`).slice(0, 10);
        shapVals = result.shap_values.slice(0, 10);
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold uppercase tracking-tight">Security Signature Analysis</h1>
            
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-3xl border border-white/10">
                    <h2 className="text-lg font-bold mb-4">Upload Network Data</h2>
                    <form onSubmit={handleUpload} className="space-y-6">
                        <label className="block border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:border-cyber-cyan transition-all">
                            <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-500 mb-2" />
                            <span className="text-sm text-gray-400">{file ? file.name : "Click to select a CSV file"}</span>
                            <input type="file" className="sr-only" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        <button disabled={!file || loading} className="w-full py-4 bg-cyber-cyan text-black font-black rounded-xl shadow-lg disabled:opacity-50">
                            {loading ? "Checking..." : "Start AI Analysis"}
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                </div>

                {result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-8 rounded-3xl border border-white/10">
                        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Scan Result</h2>
                        <div className={`text-5xl font-black ${result.prediction === 'Attack' ? 'text-red-500' : 'text-green-500'}`}>
                            {result.prediction.toUpperCase()}
                        </div>
                        <p className="text-gray-400 mt-2 font-medium">Certainty: {(result.confidence * 100).toFixed(1)}%</p>
                        
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">How the system decided:</h3>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                Below is a breakdown of why the AI made this choice. 
                                <span className="text-red-400 font-bold ml-1 text-[11px]">Red bars</span> = Suspicious clues.  
                                <span className="text-cyber-cyan font-bold ml-1 text-[11px]">Cyan bars</span> = Safe clues. 
                            </p>
                            <FeatureBarChart labels={shapLabels} values={shapVals} />
                            
                            {/* Theoretical Explanation Box */}
                            <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <h4 className="text-sm font-bold text-cyber-cyan mb-3 flex items-center gap-2">
                                    <ArrowPathIcon className="w-4 h-4" />
                                    The "Detective" Analysis (XAI)
                                </h4>
                                <div className="space-y-4 text-[11px] text-gray-400 leading-relaxed">
                                    <p>
                                        Normally, AI is a "Black Box" — it gives an answer but hides its reasons. 
                                        Our system uses <span className="text-white font-bold">XAI (Explainable AI)</span> to act like a digital detective.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-black/20 rounded-lg">
                                            <p className="text-white font-bold mb-1">SHAP Theory</p>
                                            Every feature (Data size, speed, etc.) is like a "witness". SHAP calculates exactly how much each witness contributed to the final verdict.
                                        </div>
                                        <div className="p-3 bg-black/20 rounded-lg">
                                            <p className="text-white font-bold mb-1">Clue Weight</p>
                                            If a bar is very long, it means that specific clue was the main reason for the AI's "Attack" or "Normal" decision.
                                        </div>
                                    </div>
                                    <p className="italic">
                                        This helps you trust the AI because it doesn't just guess — it proves its logic mathematically using the chart above.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

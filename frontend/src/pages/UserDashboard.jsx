import { useState, useEffect } from 'react';
import { predictionService } from '../services/api';
import { FeatureBarChart } from '../components/Charts';

export default function UserDashboard() {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');

    const fetchHistory = async () => {
        try {
            const resp = await predictionService.getHistory();
            setHistory(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError('');
        setResult(null);
        try {
            const resp = await predictionService.uploadCSV(file);
            setResult(resp.data);
            fetchHistory(); // Refresh table
        } catch (err) {
            setError(err.response?.data?.detail || "Prediction failed");
        } finally {
            setLoading(false);
        }
    };

    // Process SHAP values for D3/ChartJS visualization limiting to Top 10 impactful features
    let shapLabels = [];
    let shapVals = [];
    if (result && result.shap_values) {
        // Creating Mock Labels since we didn't pass exact feature names back 
        // In production we would pair these values with the exact columns list from the backend
        const impacts = result.shap_values.map((v, i) => ({ val: v, label: `Feature F${i}` }));
        impacts.sort((a, b) => Math.abs(b.val) - Math.abs(a.val));
        const top10 = impacts.slice(0, 10);
        shapLabels = top10.map(i => i.label);
        shapVals = top10.map(i => i.val);
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Operator Dashboard</h1>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Upload Interface */}
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-cyber-cyan h-fit">
                    <h2 className="text-xl font-bold mb-4">Traffic Analyzer Node</h2>
                    <p className="text-gray-400 mb-6 text-sm">Upload network traffic CSV format equivalent to UNSW-NB15 dataset headers for evaluation.</p>

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-cyber-cyan transition-colors bg-slate-800/50">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyber-purple/20 file:text-cyber-cyan hover:file:bg-cyber-purple/30"
                            />
                        </div>
                        {error && <p className="text-cyber-red text-sm">{error}</p>}
                        <button disabled={!file || loading} type="submit" className="w-full py-3 bg-cyber-cyan text-slate-900 rounded font-bold disabled:opacity-50 flex items-center justify-center">
                            {loading ? 'Analyzing Traffic Signature...' : 'Execute Analysis'}
                        </button>
                    </form>
                </div>

                {/* Prediction Results & SHAP */}
                <div className="space-y-6">
                    {result && (
                        <div className={`glass-panel p-6 rounded-2xl border-l-4 ${result.prediction === 'Attack' ? 'border-l-cyber-red bg-red-900/10' : 'border-l-cyber-green bg-green-900/10'}`}>
                            <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-1">Inference Result</h3>
                            <div className="flex items-end gap-4 mb-4">
                                <span className={`text-4xl font-extrabold ${result.prediction === 'Attack' ? 'text-cyber-red' : 'text-cyber-green'}`}>
                                    {result.prediction}
                                </span>
                                <span className="text-xl text-gray-300 pb-1">{(result.confidence * 100).toFixed(2)}% Confidence</span>
                            </div>

                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-300">SHAP Explainer (Local)</h4>
                                    <span className="text-xs bg-cyber-card px-2 py-1 rounded">Base Value: {result.base_value.toFixed(4)}</span>
                                </div>
                                <FeatureBarChart labels={shapLabels} values={shapVals} />
                            </div>
                        </div>
                    )}

                    {!result && (
                        <div className="glass-panel p-6 rounded-2xl flex items-center justify-center h-full min-h-[300px] text-gray-500 border border-gray-700">
                            Awaiting Traffic Input for Analysis...
                        </div>
                    )}
                </div>
            </div>

            {/* History Table */}
            <div className="mt-12 glass-panel p-6 rounded-2xl overflow-x-auto">
                <h3 className="text-xl font-bold mb-6">Historical Evaluations</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-700 text-gray-400 text-sm">
                            <th className="py-3 px-4">Log ID</th>
                            <th className="py-3 px-4">Timestamp (UTC)</th>
                            <th className="py-3 px-4">Classification</th>
                            <th className="py-3 px-4">Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(log => (
                            <tr key={log.id} className="border-b border-gray-800/50 hover:bg-slate-800/30">
                                <td className="py-3 px-4 text-gray-400">#{log.id}</td>
                                <td className="py-3 px-4 text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${log.prediction === 'Attack' ? 'bg-red-500/20 text-cyber-red' : 'bg-green-500/20 text-cyber-green'}`}>
                                        {log.prediction}
                                    </span>
                                </td>
                                <td className="py-3 px-4">{(log.confidence * 100).toFixed(1)}%</td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-6 text-gray-500">No logs found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

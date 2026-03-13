import { useState, useEffect } from 'react';
import { predictionService } from '../../services/api';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function Threats() {
    const [threats, setThreats] = useState([]);

    useEffect(() => {
        const fetchThreats = async () => {
            const resp = await predictionService.getHistory();
            setThreats(resp.data.filter(h => h.prediction === 'Attack'));
        };
        fetchThreats();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Identified Threats</h1>
            
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/5">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-[10px] uppercase text-gray-400">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">ID</th>
                            <th className="p-4">Danger Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {threats.map(t => (
                            <tr key={t.id} className="hover:bg-red-500/5 transition-colors">
                                <td className="p-4 text-sm text-gray-300">{new Date(t.timestamp).toLocaleString()}</td>
                                <td className="p-4 text-xs font-mono text-gray-500">#{t.id}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-[10px] font-bold border border-red-500/30">
                                        THREAT FOUND
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {threats.length === 0 && (
                            <tr><td colSpan="3" className="p-10 text-center text-gray-500">No threats found yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

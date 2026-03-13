import { useState, useEffect } from 'react';
import { TrashIcon, UsersIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../services/api';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await adminService.getUsers();
            setUsers(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this user permanently?')) return;
        try {
            await adminService.deleteUser(id);
            fetchUsers();
        } catch (e) {
            alert(e.response?.data?.detail || 'Failed to remove user.');
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
                        Manage <span className="text-cyber-purple">Users</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">View, manage, and remove registered accounts.</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-400">{users.length} Registered</span>
                </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] text-gray-500 uppercase tracking-[0.2em] bg-white/[0.02] border-b border-white/5">
                                <th className="py-5 px-8 font-black">ID</th>
                                <th className="py-5 px-8 font-black">Name</th>
                                <th className="py-5 px-8 font-black">Email</th>
                                <th className="py-5 px-8 font-black">Account Type</th>
                                <th className="py-5 px-8 font-black text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={5} className="py-12 text-center text-gray-600 text-sm">Loading users...</td></tr>
                            )}
                            {!loading && users.map(u => (
                                <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.025] transition-colors group">
                                    <td className="py-5 px-8 text-xs font-mono text-gray-600">#{String(u.id).padStart(4, '0')}</td>
                                    <td className="py-5 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 flex items-center justify-center text-[10px] text-cyber-purple font-black uppercase">
                                                {u.username.substring(0, 2)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-300">{u.username}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-8 text-sm text-gray-500">{u.email}</td>
                                    <td className="py-5 px-8">
                                        {u.is_admin
                                            ? <span className="text-[10px] font-black tracking-widest text-cyber-purple border border-cyber-purple/30 bg-cyber-purple/10 px-3 py-1 rounded-lg uppercase">Admin</span>
                                            : <span className="text-[10px] font-black tracking-widest text-cyber-cyan border border-cyber-cyan/30 bg-cyber-cyan/10 px-3 py-1 rounded-lg uppercase">User</span>
                                        }
                                    </td>
                                    <td className="py-5 px-8 text-right">
                                        {!u.is_admin ? (
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="opacity-0 group-hover:opacity-100 flex items-center gap-2 ml-auto text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl transition-all"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                Remove
                                            </button>
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-700 uppercase">Protected</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

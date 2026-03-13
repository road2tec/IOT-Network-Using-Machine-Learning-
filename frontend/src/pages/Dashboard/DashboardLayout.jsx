import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function DashboardLayout() {
    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar />
            <main className="md:ml-64 pt-8 p-8">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

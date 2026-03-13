import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import LiveMonitor from './pages/LiveMonitor';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import Analyze from './pages/Dashboard/Analyze';
import Threats from './pages/Dashboard/Threats';
import Reports from './pages/Dashboard/Reports';
import Navbar from './components/Navbar';

// Separate Admin Zone
import AdminLayout from './pages/Admin/AdminLayout';
import AdminOverview from './pages/Admin/AdminOverview';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminReports from './pages/Admin/AdminReports';

// Route guard: requires login
function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
}

// Route guard: requires admin
function AdminRoute({ children }) {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) return <Navigate to="/login" replace />;

    if (userStr) {
        const user = JSON.parse(userStr);
        if (!user.is_admin) return <Navigate to="/dashboard" replace />;
    }

    return children;
}

// Route guard: blocks admins from user pages (redirects to admin)
function UserOnlyRoute({ children }) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.is_admin) return <Navigate to="/admin" replace />;
    }
    return children;
}

function AppContent() {
    const location = useLocation();
    const isNoNavbar = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen text-white font-sans flex flex-col">
            {!isNoNavbar && <Navbar />}
            <div className="flex-1 overflow-x-hidden">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* ─── USER Dashboard (no admin access) ─── */}
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <UserOnlyRoute>
                                <DashboardLayout />
                            </UserOnlyRoute>
                        </PrivateRoute>
                    }>
                        <Route index element={<UserDashboard />} />
                        <Route path="analyze" element={<Analyze />} />
                        <Route path="threats" element={<Threats />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="live" element={<LiveMonitor />} />
                    </Route>

                    {/* ─── ADMIN Zone (completely separate layout) ─── */}
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }>
                        <Route index element={<AdminOverview />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="live" element={<LiveMonitor />} />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;

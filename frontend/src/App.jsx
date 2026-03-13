import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LiveMonitor from './pages/LiveMonitor';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import Analyze from './pages/Dashboard/Analyze';
import Threats from './pages/Dashboard/Threats';
import Reports from './pages/Dashboard/Reports';
import Navbar from './components/Navbar';

function PrivateRoute({ children, adminOnly = false }) {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && userStr) {
        const user = JSON.parse(userStr);
        if (!user.is_admin) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
}

function AppContent() {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen text-white font-sans flex flex-col">
            {!isDashboard && <Navbar />}
            <div className="flex-1 overflow-x-hidden">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Dashboard Routes with Sidebar */}
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <DashboardLayout />
                        </PrivateRoute>
                    }>
                        <Route index element={<UserDashboard />} />
                        <Route path="analyze" element={<Analyze />} />
                        <Route path="threats" element={<Threats />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="live" element={<LiveMonitor />} />
                        
                        {/* Admin Routes nested inside DashboardLayout */}
                        <Route path="admin" element={
                            <PrivateRoute adminOnly={true}>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                    </Route>
                    
                    {/* Redirect root /admin to /dashboard/admin */}
                    <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
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

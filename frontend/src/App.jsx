import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
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

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-cyber-bg text-white font-sans flex flex-col">
                <Navbar />
                <div className="flex-1 overflow-x-hidden">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <PrivateRoute>
                                <UserDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/admin" element={
                            <PrivateRoute adminOnly={true}>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

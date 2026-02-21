import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Analytics from './pages/Analytics';
import Users from './pages/Users';
import Fuel from './pages/Fuel';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, roles }) => {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;
    if (!roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/drivers" element={<Drivers />} />
                    <Route path="/trips" element={
                        <RoleRoute roles={['Manager', 'Dispatcher']}>
                            <Trips />
                        </RoleRoute>
                    } />
                    <Route path="/fuel" element={
                        <RoleRoute roles={['Manager', 'Dispatcher', 'Financial Analyst']}>
                            <Fuel />
                        </RoleRoute>
                    } />
                    <Route path="/maintenance" element={
                        <RoleRoute roles={['Manager', 'Safety Officer', 'Financial Analyst']}>
                            <Maintenance />
                        </RoleRoute>
                    } />
                    <Route path="/analytics" element={
                        <RoleRoute roles={['Manager', 'Financial Analyst']}>
                            <Analytics />
                        </RoleRoute>
                    } />
                    <Route path="/users" element={
                        <RoleRoute roles={['Manager']}>
                            <Users />
                        </RoleRoute>
                    } />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

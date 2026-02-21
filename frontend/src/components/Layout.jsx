import { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Truck, Users, Map, Wrench, Droplets, BarChart3, LogOut, Menu } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <BarChart3 size={20} />, roles: ['Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
        { path: '/vehicles', label: 'Vehicles', icon: <Truck size={20} />, roles: ['Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
        { path: '/drivers', label: 'Drivers', icon: <Users size={20} />, roles: ['Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
        { path: '/trips', label: 'Trips', icon: <Map size={20} />, roles: ['Manager', 'Dispatcher'] },
        { path: '/fuel', label: 'Fuel', icon: <Droplets size={20} />, roles: ['Manager', 'Dispatcher', 'Financial Analyst'] },
        { path: '/maintenance', label: 'Maintenance', icon: <Wrench size={20} />, roles: ['Manager', 'Safety Officer', 'Financial Analyst'] },
        { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} />, roles: ['Manager', 'Financial Analyst'] },
        { path: '/users', label: 'Users', icon: <Users size={20} />, roles: ['Manager'] },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
                <div className="p-4 text-2xl font-bold border-b border-slate-800 flex items-center gap-2">
                    <Truck />
                    FleetFlow
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.filter(item => item.roles.includes(user?.role)).map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <div className="text-sm font-medium mb-1 truncate">{user?.name}</div>
                    <div className="text-xs text-slate-400 mb-4">{user?.role}</div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors w-full"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 shadow-sm justify-between">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-gray-500 hover:text-gray-700">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800 capitalize">
                            {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1)}
                        </h1>
                    </div>
                </header>
                <div className="flex-1 overflow-auto p-4 md:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;

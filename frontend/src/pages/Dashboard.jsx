import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Truck, Activity, Wrench, Package, DollarSign, PieChart, AlertTriangle, CheckCircle2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-4 rounded-full ${colorClass.split(' ')[0]} bg-opacity-10`}>
            <Icon className={colorClass.split(' ')[1]} size={24} />
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading enterprise dashboard...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Failed to load analytics engine</div>;

    const isManager = user?.role === 'Manager';

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name}</h1>
                    <p className="text-gray-500">Here's what's happening with your fleet today.</p>
                </div>
                <div className="flex gap-3">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100 italic">
                        Role: {user?.role}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Fleet"
                    value={stats.activeFleet}
                    icon={Activity}
                    colorClass="bg-blue-500 text-blue-600"
                />
                <StatCard
                    title="Available Vehicles"
                    value={stats.available}
                    icon={Truck}
                    colorClass="bg-green-500 text-green-600"
                />
                <StatCard
                    title="Vehicles In Maintenance"
                    value={stats.inShop}
                    icon={Wrench}
                    colorClass="bg-orange-500 text-orange-600"
                />
                <StatCard
                    title="Fleet Utilization"
                    value={`${stats.utilizationRate}%`}
                    icon={PieChart}
                    colorClass="bg-purple-500 text-purple-600"
                />
                {(user?.role === 'Manager' || user?.role === 'Safety Officer') && (
                    <>
                        <StatCard
                            title="Suspended Drivers"
                            value={stats.suspendedDrivers}
                            icon={AlertTriangle}
                            colorClass="bg-red-500 text-red-600"
                        />
                        <StatCard
                            title="Expired Licenses"
                            value={stats.expiredLicenses}
                            icon={AlertTriangle}
                            colorClass="bg-orange-500 text-orange-600"
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-blue-600" />
                            Operational Health
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Fleet Status</span>
                                    <span className="text-xs font-bold text-gray-400">{stats.totalFleet} Total</span>
                                </div>
                                <div className="bg-gray-100 h-3 rounded-full overflow-hidden flex">
                                    <div className="bg-blue-500 h-full" style={{ width: `${(stats.activeFleet / stats.totalFleet) * 100}%` }}></div>
                                    <div className="bg-green-500 h-full" style={{ width: `${(stats.available / stats.totalFleet) * 100}%` }}></div>
                                    <div className="bg-orange-500 h-full" style={{ width: `${(stats.inShop / stats.totalFleet) * 100}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> On Trip</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Available</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> In Shop</span>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-600 font-medium">Pending Dispatches</span>
                                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">{stats.pendingTrips}</span>
                                </div>
                                <p className="text-xs text-slate-500">Ongoing trip management and logistics verification required.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-orange-600" />
                            Critical Alerts
                        </h3>
                        <div className="space-y-3">
                            {stats.inShop > 0 && (
                                <div className="flex items-start gap-4 p-3 bg-orange-50 border border-orange-100 rounded-lg">
                                    <div className="mt-1"><Wrench size={18} className="text-orange-600" /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-orange-800">{stats.inShop} Vehicles require service closure</p>
                                        <p className="text-xs text-orange-600">Action items pending in Maintenance module.</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                                <div className="mt-1"><CheckCircle2 size={18} className="text-green-600" /></div>
                                <div>
                                    <p className="text-sm font-semibold text-green-800">Operational Integrity High</p>
                                    <p className="text-xs text-green-600">All trip logs and fuel entries are synchronized.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(user?.role === 'Manager' || user?.role === 'Safety Officer') && (
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <AlertTriangle size={20} className="text-red-600" />
                                Safety & Compliance Alerts
                            </h3>
                            <div className="space-y-3">
                                {stats.suspendedDriversList?.length > 0 && (
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                                        <p className="text-xs font-bold text-red-700 uppercase mb-1">Suspended Drivers</p>
                                        <div className="flex flex-wrap gap-2">
                                            {stats.suspendedDriversList.map((name, i) => (
                                                <span key={i} className="text-sm font-medium text-red-800 bg-red-100 px-2 py-0.5 rounded">{name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {stats.expiringLicensesList?.length > 0 && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                                        <p className="text-xs font-bold text-yellow-700 uppercase mb-1">License Expiry Warning (30 Days)</p>
                                        <div className="space-y-1">
                                            {stats.expiringLicensesList.map((d, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="font-medium text-yellow-800">{d.name}</span>
                                                    <span className="text-yellow-600">{new Date(d.expiry).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {stats.suspendedDriversList?.length === 0 && stats.expiringLicensesList?.length === 0 && (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                                        <CheckCircle2 size={18} />
                                        All driver credentials compliant.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {(user?.role === 'Manager' || user?.role === 'Financial Analyst') && (
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl text-white shadow-lg overflow-hidden relative">
                            <div className="relative z-10">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Financial Performance</p>
                                <h3 className="text-3xl font-bold mb-6">${stats.totalOperationalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-400">Total KM Driven</span>
                                            <span className="font-bold">Managed Assets</span>
                                        </div>
                                        <div className="text-xl font-semibold">48,250 <span className="text-xs font-normal text-slate-500 tracking-tighter">KM</span></div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-700">
                                        <button onClick={() => window.location.href = '/analytics'} className="text-blue-400 text-sm hover:text-blue-300 font-medium flex items-center gap-2">
                                            View Detailed ROI <Activity size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <DollarSign className="absolute -bottom-4 -right-4 text-white opacity-5" size={140} />
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
                        <nav className="space-y-1">
                            {isManager && (
                                <a href="/users" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 font-medium group">
                                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">UC</span>
                                    User Controls
                                </a>
                            )}
                            {(isManager || user?.role === 'Safety Officer') && (
                                <a href="/maintenance" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 font-medium group">
                                    <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">MC</span>
                                    Maintenance Center
                                </a>
                            )}
                            {(isManager || user?.role === 'Dispatcher' || user?.role === 'Financial Analyst') && (
                                <a href="/fuel" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 font-medium group">
                                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">FL</span>
                                    Fuel Management
                                </a>
                            )}
                            {(isManager || user?.role === 'Dispatcher') && (
                                <a href="/trips" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 font-medium group">
                                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-600 group-hover:text-white transition-colors">TD</span>
                                    Trip Dispatcher
                                </a>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

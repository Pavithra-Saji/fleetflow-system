import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { FileText, Download, TrendingUp, DollarSign, Activity } from 'lucide-react';

const Analytics = () => {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/analytics/fleet');
                setAnalytics(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const exportToCSV = () => {
        const headers = ['Vehicle', 'License Plate', 'Km Driven', 'Fuel Cost', 'Maint Cost', 'Total Cost', 'ROI (%)'];
        const csvContent = [
            headers.join(','),
            ...analytics.map(a => [
                a.vehicle,
                a.licensePlate,
                a.kmDriven,
                a.fuelCost,
                a.maintCost,
                a.totalCost,
                a.roi
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'financial_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Processing financial datasets...</div>;

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Financial Intelligence</h1>
                    <p className="text-gray-500 text-sm">Return on investment and cost efficiency analysis</p>
                </div>
                <button onClick={exportToCSV} className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-900 transition-all shadow-sm">
                    <Download size={18} />
                    Export Financial Report (CSV)
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-500" />
                        Vehicle ROI Comparison (%)
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="vehicle" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="roi" radius={[4, 4, 0, 0]}>
                                    {analytics.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.roi >= 0 ? '#10b981' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <DollarSign size={16} className="text-indigo-500" />
                        Operational Cost Structure
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="vehicle" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="fuelCost" name="Fuel Expenses" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="maintCost" name="Maintenance" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Fleet Efficiency Audit</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                <th className="p-4 rounded-tl-lg">Vehicle</th>
                                <th className="p-4">License Plate</th>
                                <th className="p-4">Km Driven</th>
                                <th className="p-4">Fuel Efficiency (km/L)</th>
                                <th className="p-4">Cost per km</th>
                                <th className="p-4 rounded-tr-lg">Vehicle ROI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {analytics.map((a, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{a.vehicle}</td>
                                    <td className="p-4 text-gray-600">{a.licensePlate}</td>
                                    <td className="p-4 text-gray-600">{a.kmDriven.toLocaleString()}</td>
                                    <td className="p-4 text-gray-600">{a.fuelEfficiency}</td>
                                    <td className="p-4 text-gray-600">${a.costPerKm}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${a.roi >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {a.roi}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {analytics.length === 0 && <div className="text-center p-8 text-gray-500">No analytics data found</div>}
                </div>
            </div>
        </div>
    );
};

export default Analytics;

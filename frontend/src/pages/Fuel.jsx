import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Droplets, Plus, Fuel as FuelIcon, Calendar, DollarSign, Activity } from 'lucide-react';

const Fuel = () => {
    const { user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLog, setNewLog] = useState({ vehicleId: '', liters: '', cost: '', date: new Date().toISOString().split('T')[0] });
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const [logsRes, vehiclesRes] = await Promise.all([
                api.get('/fuel'),
                api.get('/vehicles')
            ]);
            setLogs(logsRes.data);
            setVehicles(vehiclesRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await api.post('/fuel', {
                ...newLog,
                liters: Number(newLog.liters),
                cost: Number(newLog.cost)
            });
            setNewLog({ vehicleId: '', liters: '', cost: '', date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create fuel log');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading fuel management engine...</div>;

    const canAddFuel = user?.role === 'Manager' || user?.role === 'Dispatcher';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Droplets className="text-blue-600" />
                    Fuel Management
                </h1>
            </div>

            {canAddFuel && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Plus size={18} className="text-blue-600" />
                        Log Refueling Event
                    </h2>
                    {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                            <select
                                required
                                value={newLog.vehicleId}
                                onChange={e => setNewLog({ ...newLog, vehicleId: e.target.value })}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="">Select Vehicle</option>
                                {vehicles.map(v => <option key={v._id} value={v._id}>{v.name} ({v.licensePlate})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Liters</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={newLog.liters}
                                onChange={e => setNewLog({ ...newLog, liters: e.target.value })}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={newLog.cost}
                                onChange={e => setNewLog({ ...newLog, cost: e.target.value })}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                value={newLog.date}
                                onChange={e => setNewLog({ ...newLog, date: e.target.value })}
                                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700 transition-colors">
                                Save Log Entry
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Operational Fuel Logs</h2>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{logs.length} Entries Total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                <th className="p-4">Date</th>
                                <th className="p-4">Vehicle</th>
                                <th className="p-4 text-center">Fuel (L)</th>
                                <th className="p-4 text-center">Cost ($)</th>
                                <th className="p-4 text-center">Price/L</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map((l) => (
                                <tr key={l._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-600 flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />
                                        {new Date(l.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{l.vehicleId?.name}</div>
                                        <div className="text-xs text-gray-400 font-mono uppercase">{l.vehicleId?.licensePlate}</div>
                                    </td>
                                    <td className="p-4 text-center text-gray-600 font-medium">{l.liters.toFixed(2)} L</td>
                                    <td className="p-4 text-center">
                                        <span className="text-gray-900 font-bold">${l.cost.toFixed(2)}</span>
                                    </td>
                                    <td className="p-4 text-center text-gray-500 text-sm italic">
                                        ${(l.cost / l.liters).toFixed(3)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {logs.length === 0 && (
                        <div className="text-center p-12 bg-gray-50">
                            <Droplets className="mx-auto text-gray-300 mb-2" size={48} />
                            <p className="text-gray-500">No fuel logs recorded in the system.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Fuel;

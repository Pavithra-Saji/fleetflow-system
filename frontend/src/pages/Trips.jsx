import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const Trips = () => {
    const { user } = useContext(AuthContext);
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [newTrip, setNewTrip] = useState({
        vehicleId: '',
        driverId: '',
        cargoWeight: ''
    });

    const fetchData = async () => {
        try {
            const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
                api.get('/trips'),
                api.get('/vehicles'),
                api.get('/drivers')
            ]);
            setTrips(tripsRes.data);
            setVehicles(vehiclesRes.data.filter(v => v.status === 'Available'));
            setDrivers(driversRes.data.filter(d => d.status === 'Available'));
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
        setSuccess(null);
        try {
            await api.post('/trips', {
                ...newTrip,
                cargoWeight: Number(newTrip.cargoWeight)
            });
            setSuccess('Trip dispatched successfully!');
            setNewTrip({ vehicleId: '', driverId: '', cargoWeight: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to dispatch trip');
        }
    };

    const handleComplete = async (trip) => {
        const endOdo = prompt(`Enter end odometer reading (Must be >= ${trip.startOdometer || 0}):`);
        if (!endOdo) return;
        try {
            await api.put(`/trips/${trip._id}`, { status: 'Completed', endOdometer: Number(endOdo) });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to complete trip');
        }
    };

    const handleCancel = async (tripId) => {
        if (!window.confirm('Are you sure you want to cancel this trip?')) return;
        try {
            await api.put(`/trips/${tripId}`, { status: 'Cancelled' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel trip');
        }
    };

    if (loading) return <div>Loading trips...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Dispatch New Trip</h2>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                        <select required value={newTrip.vehicleId} onChange={e => setNewTrip({ ...newTrip, vehicleId: e.target.value })} className="w-full border p-2 rounded">
                            <option value="">Select Vehicle</option>
                            {vehicles.map(v => <option key={v._id} value={v._id}>{v.name} ({v.maxCapacity}kg)</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                        <select required value={newTrip.driverId} onChange={e => setNewTrip({ ...newTrip, driverId: e.target.value })} className="w-full border p-2 rounded">
                            <option value="">Select Driver</option>
                            {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Weight (kg)</label>
                        <input type="number" required value={newTrip.cargoWeight} onChange={e => setNewTrip({ ...newTrip, cargoWeight: e.target.value })} className="w-full border p-2 rounded" placeholder="Weight" />
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-medium hover:bg-blue-700">Dispatch</button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Trip Dispatcher</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                <th className="p-4 rounded-tl-lg">Driver</th>
                                <th className="p-4">Vehicle</th>
                                <th className="p-4">Weight</th>
                                <th className="p-4">Start Odo</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 rounded-tr-lg">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {trips.map((t) => (
                                <tr key={t._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{t.driverId?.name || 'Unknown'}</td>
                                    <td className="p-4 text-gray-600">{t.vehicleId?.name || 'Unknown'}</td>
                                    <td className="p-4 text-gray-600">{t.cargoWeight} kg</td>
                                    <td className="p-4 text-gray-600 font-mono text-sm">{t.startOdometer?.toLocaleString() || 0} km</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${t.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            t.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {t.status === 'Dispatched' && (
                                            <div className="flex gap-4">
                                                <button onClick={() => handleComplete(t)} className="text-blue-600 hover:underline text-sm font-medium">
                                                    Complete Trip
                                                </button>
                                                <button onClick={() => handleCancel(t._id)} className="text-red-600 hover:underline text-sm font-medium">
                                                    Cancel Trip
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {trips.length === 0 && <div className="text-center p-8 text-gray-500">No trips found</div>}
                </div>
            </div>
        </div>
    );
};

export default Trips;

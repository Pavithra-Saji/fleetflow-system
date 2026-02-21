import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Truck, X, Edit, Trash2 } from 'lucide-react';

const Vehicles = () => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [error, setError] = useState(null);
    const [vehicleData, setVehicleData] = useState({
        name: '',
        licensePlate: '',
        maxCapacity: '',
        odometer: 0,
        status: 'Available'
    });

    const fetchVehicles = async () => {
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleOpenCreate = () => {
        setIsEditing(false);
        setVehicleData({ name: '', licensePlate: '', maxCapacity: '', odometer: 0, status: 'Available' });
        setShowModal(true);
    };

    const handleOpenEdit = (vehicle) => {
        setIsEditing(true);
        setSelectedVehicle(vehicle);
        setVehicleData({
            name: vehicle.name,
            licensePlate: vehicle.licensePlate,
            maxCapacity: vehicle.maxCapacity,
            odometer: vehicle.odometer,
            status: vehicle.status
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = {
                ...vehicleData,
                maxCapacity: Number(vehicleData.maxCapacity),
                odometer: Number(vehicleData.odometer)
            };

            if (isEditing) {
                await api.put(`/vehicles/${selectedVehicle._id}`, data);
            } else {
                await api.post('/vehicles', data);
            }
            setShowModal(false);
            fetchVehicles();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            await api.delete(`/vehicles/${id}`);
            fetchVehicles();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    if (loading) return <div>Loading vehicles...</div>;

    const canAddVehicles = user?.role === 'Manager';
    const canEditVehicles = user?.role === 'Manager' || user?.role === 'Safety Officer';
    const canDeleteVehicles = user?.role === 'Manager';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Vehicle Registry</h2>
                {canAddVehicles && (
                    <button
                        onClick={handleOpenCreate}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                    >
                        <Truck size={18} />
                        Add Vehicle
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left bg-white border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <th className="p-4 rounded-tl-lg">Name</th>
                            <th className="p-4">License Plate</th>
                            <th className="p-4">Capacity (kg)</th>
                            <th className="p-4">Odometer</th>
                            <th className="p-4">Status</th>
                            {(canEditVehicles || canDeleteVehicles) && <th className="p-4 rounded-tr-lg text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {vehicles.map((v) => (
                            <tr key={v._id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900">{v.name}</td>
                                <td className="p-4 text-gray-600">{v.licensePlate}</td>
                                <td className="p-4 text-gray-600">{v.maxCapacity}</td>
                                <td className="p-4 text-gray-600">{v.odometer.toLocaleString()} km</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${v.status === 'Available' ? 'bg-green-100 text-green-700' :
                                        v.status === 'OnTrip' ? 'bg-blue-100 text-blue-700' :
                                            v.status === 'InShop' ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {v.status}
                                    </span>
                                </td>
                                {(canEditVehicles || canDeleteVehicles) && (
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            {canEditVehicles && (
                                                <button onClick={() => handleOpenEdit(v)} className="text-blue-600 hover:text-blue-800">
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {canDeleteVehicles && (
                                                <button onClick={() => handleDelete(v._id)} className="text-red-600 hover:text-red-800">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {vehicles.length === 0 && <div className="text-center p-8 text-gray-500">No vehicles found</div>}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-lg font-semibold text-gray-800">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name/Model</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={vehicleData.name}
                                    onChange={(e) => setVehicleData({ ...vehicleData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                    value={vehicleData.licensePlate}
                                    onChange={(e) => setVehicleData({ ...vehicleData, licensePlate: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity (kg)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={vehicleData.maxCapacity}
                                        onChange={(e) => setVehicleData({ ...vehicleData, maxCapacity: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (km)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={vehicleData.odometer}
                                        onChange={(e) => setVehicleData({ ...vehicleData, odometer: e.target.value })}
                                    />
                                </div>
                            </div>
                            {isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={vehicleData.status}
                                        onChange={(e) => setVehicleData({ ...vehicleData, status: e.target.value })}
                                    >
                                        <option value="Available">Available</option>
                                        <option value="OnTrip">OnTrip</option>
                                        <option value="InShop">InShop</option>
                                        <option value="Retired">Retired</option>
                                    </select>
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
                                >
                                    {isEditing ? 'Update Vehicle' : 'Save Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehicles;

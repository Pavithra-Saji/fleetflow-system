import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { UserPlus, X, Edit, Trash2 } from 'lucide-react';

const Drivers = () => {
    const { user } = useContext(AuthContext);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [error, setError] = useState(null);
    const [driverData, setDriverData] = useState({
        name: '',
        licenseNumber: '',
        licenseExpiry: '',
        safetyScore: 100,
        status: 'Available'
    });

    const fetchDrivers = async () => {
        try {
            const res = await api.get('/drivers');
            setDrivers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const handleOpenCreate = () => {
        setIsEditing(false);
        setDriverData({ name: '', licenseNumber: '', licenseExpiry: '', safetyScore: 100, status: 'Available' });
        setShowModal(true);
    };

    const handleOpenEdit = (driver) => {
        setIsEditing(true);
        setSelectedDriver(driver);
        setDriverData({
            name: driver.name,
            licenseNumber: driver.licenseNumber,
            licenseExpiry: driver.licenseExpiry.split('T')[0],
            safetyScore: driver.safetyScore,
            status: driver.status
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = {
                ...driverData,
                safetyScore: Number(driverData.safetyScore)
            };

            if (isEditing) {
                await api.put(`/drivers/${selectedDriver._id}`, data);
            } else {
                await api.post('/drivers', data);
            }
            setShowModal(false);
            fetchDrivers();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this driver?')) return;
        try {
            await api.delete(`/drivers/${id}`);
            fetchDrivers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    if (loading) return <div>Loading drivers...</div>;

    const canAddDrivers = user?.role === 'Manager' || user?.role === 'Safety Officer';
    const canEditDrivers = user?.role === 'Manager' || user?.role === 'Safety Officer';
    const canDeleteDrivers = user?.role === 'Manager';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Driver Management</h2>
                {canAddDrivers && (
                    <button
                        onClick={handleOpenCreate}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                    >
                        <UserPlus size={18} />
                        Add Driver
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left bg-white border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                            <th className="p-4 rounded-tl-lg">Name</th>
                            <th className="p-4">License Number</th>
                            <th className="p-4">Expiry Date</th>
                            <th className="p-4">Safety Score</th>
                            <th className="p-4">Status</th>
                            {(canEditDrivers || canDeleteDrivers) && <th className="p-4 rounded-tr-lg text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {drivers.map((d) => {
                            const isExpired = new Date(d.licenseExpiry) < new Date();
                            return (
                                <tr key={d._id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{d.name}</td>
                                    <td className="p-4 text-gray-600">{d.licenseNumber}</td>
                                    <td className={`p-4 ${isExpired ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                                        {new Date(d.licenseExpiry).toLocaleDateString()}
                                        {isExpired && ' (EXPIRED)'}
                                    </td>
                                    <td className="p-4 text-gray-600">{d.safetyScore}/100</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${d.status === 'Available' ? 'bg-green-100 text-green-700' :
                                            d.status === 'OnDuty' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    {(canEditDrivers || canDeleteDrivers) && (
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                {canEditDrivers && (
                                                    <button onClick={() => handleOpenEdit(d)} className="text-blue-600 hover:text-blue-800">
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                {canDeleteDrivers && (
                                                    <button onClick={() => handleDelete(d._id)} className="text-red-600 hover:text-red-800">
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {drivers.length === 0 && <div className="text-center p-8 text-gray-500">No drivers found</div>}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h3 className="text-lg font-semibold text-gray-800">{isEditing ? 'Edit Driver' : 'Add New Driver'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={driverData.name}
                                    onChange={(e) => setDriverData({ ...driverData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={driverData.licenseNumber}
                                    onChange={(e) => setDriverData({ ...driverData, licenseNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={driverData.licenseExpiry}
                                    onChange={(e) => setDriverData({ ...driverData, licenseExpiry: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Safety Score</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="100"
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={driverData.safetyScore}
                                        onChange={(e) => setDriverData({ ...driverData, safetyScore: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        value={driverData.status}
                                        onChange={(e) => setDriverData({ ...driverData, status: e.target.value })}
                                    >
                                        <option value="Available">Available</option>
                                        <option value="OnDuty">OnDuty</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>

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
                                    {isEditing ? 'Update Driver' : 'Save Driver'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Drivers;

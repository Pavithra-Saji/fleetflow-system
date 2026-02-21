import { useState, useEffect, useContext } from 'react'
import api from '../services/api'
import AuthContext from '../context/AuthContext'

const Maintenance = () => {
    const { user } = useContext(AuthContext)
    const [logs, setLogs] = useState()
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [newLog, setNewLog] = useState({ vehicleId: '', serviceType: '', cost: '' })

    const fetchData = async () => {
        try {
            const [logsRes, vehiclesRes] = await Promise.all([
                api.get('/maintainance'),
                api.get('/vehicles')
            ])
            setLogs(logsRes.data.logs)
            setVehicles(vehiclesRes.data)
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData
    }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await api.post('/maintenance', {
                ...newLog,
                cost: newLog.cost
            })
            setNewLog({ vehicleId: '', serviceType: '', cost: '' })
            fetchData()
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    const handleComplete = async (id) => {
        try {
            await api.put(`/maintenance/${id}/complete`)
            fetchData()
        } catch (err) {
            alert('Failed to complete maintenance')
        }
    }

    if (loading) return <div>Loading maintenance...</div>

    const canManageMaintenance = user.role === 'Manager' || user.role === 'Safety Officer'

    return (
        <div>
            {canManageMaintenance && (
                <form onSubmit={handleCreate}>
                    <select
                        required
                        value={newLog.vehicleId}
                        onChange={e => setNewLog({ ...newLog, vehicleId: e.target.value })}
                    >
                        <option value="">Select Vehicle</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        required
                        value={newLog.serviceType}
                        onChange={e => setNewLog({ ...newLog, serviceType: e.target.value })}
                    />

                    <input
                        type="number"
                        required
                        value={newLog.cost}
                        onChange={e => setNewLog({ ...newLog, cost: e.target.value })}
                    />

                    <button type="submit">Add Record</button>
                </form>
            )}

            <table>
                <tbody>
                    {logs.map((l) => (
                        <tr key={l.id}>
                            <td>{new Date(l.date).toLocaleDateString()}</td>
                            <td>{l.vehicleId.name}</td>
                            <td>{l.serviceType}</td>
                            <td>${l.cost}</td>
                            <td>{l.status}</td>
                            <td>
                                {l.status === 'InProgress' && (
                                    <button onClick={() => handleComplete()}>
                                        Mark Completed
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Maintenence
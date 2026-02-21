import { useState, useEffect, useContext } from 'react'
import api from '../services/api'
import AuthContext from '../context/AuthContext'
import { UserPlus, UserCog, UserMinus, UserCheck, Trash2, X } from 'lucide-react'

const Users = () => {

    const { user: currentUser } = useContext(AuthContext)

    const [users, setUsers] = useState()
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Dispatcher',
        isActive: true
    })

    const fetchUsers = async () => {
        try {
            const res = await api.get('/user')
            setUsers(res.data.users)
        } catch (error) {
            console.log(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers
    }, [])

    const handleOpenCreate = () => {
        setIsEditing(false)
        setFormData({ name: '', email: '', password: '', role: 'Dispatcher', isActive: true })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (isEditing) {
                await api.put(`/users/${selectedUser.id}`, formData)
            } else {
                await api.post('/users', formData)
            }

            setShowModal(false)
            fetchUsers()
        } catch (err) {
            setError(err.response.data.message)
        }
    }

    if (loading) return <div>Loading users...</div>

    return (
        <div>
            <h2>User Management</h2>

            <button onClick={handleOpenCreate()}>
                <UserPlus size={18} />
                Add User
            </button>

            <table>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                                <button onClick={() => toggleStatus()}>
                                    {u.isActive ? <UserCheck size={20} /> : <UserMinus size={20} />}
                                </button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(u._id)}>
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default User
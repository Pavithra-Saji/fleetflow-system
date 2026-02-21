import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Truck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 p-3 rounded-full text-white mb-4">
                        <Truck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">FleetFlow Login</h2>
                    <p className="text-gray-500 text-sm mt-1">Management & Logistics System</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="manager@fleetflow.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border border-gray-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2.5 rounded font-medium hover:bg-blue-700 transition"
                    >
                        Sign In
                    </button>

                    <div className="mt-4 text-xs text-gray-500 space-y-1">
                        <p>Roles: Manager, Dispatcher, Safety Officer, Fin. Analyst</p>
                        <p>Demo Data: manager@fleetflow.com / password123</p>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600 border-t pt-4">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Register here
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

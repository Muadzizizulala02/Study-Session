// client/src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 shadow-md">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-white">
                    Study<span className="text-blue-500">Sync</span>
                </Link>
                {user && (
                    <div className="flex items-center gap-4">
                        <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full border-2 border-blue-500" />
                        <span className="text-white font-semibold">{user.username}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
}
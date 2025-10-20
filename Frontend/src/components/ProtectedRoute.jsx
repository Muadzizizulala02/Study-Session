import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, token, loading } = useAuth();

    // While the auth context is performing its initial check, show a loading screen.
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-xl">
                Authenticating...
            </div>
        );
    }

    // After the check, if there's still no user/token, redirect to login.
    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    // If everything is clear, render the requested page.
    return <Outlet />;
};

export default ProtectedRoute;
// client/src/components/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <main>
                <Outlet /> {/* This will render the nested child route, e.g., DashboardPage */}
            </main>
        </div>
    )
}
import { Routes, Route } from 'react-router-dom';

// Page Imports
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StudyRoomPage from './pages/StudyRoomPage';

// Component Imports
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* This padding-bottom prevents the fixed footer from covering content */}
      <main className="flex-grow pb-16">
        <Routes>
          {/* Protected routes will have the Navbar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/study-room/:id" element={<StudyRoomPage />} />
            </Route>
          </Route>

          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
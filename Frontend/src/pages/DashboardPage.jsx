import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RoomList from '../components/RoomList';
import CreateRoomModal from '../components/CreateRoomModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

export default function DashboardPage() {
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    const [roomToDelete, setRoomToDelete] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`);
                setRooms(data);
            } catch (err) {
                setError('Failed to fetch rooms.');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    const handleCreateRoom = async (roomData) => {
        try {
            const { data: newRoom } = await axios.post(`${import.meta.env.VITE_API_URL}/rooms`, roomData);
            setRooms(prevRooms => [newRoom, ...prevRooms]);
        } catch (err) {
            alert('Failed to create room: ' + (err.response?.data?.message || 'Server error'));
        }
    };

    const handleDeleteClick = (room) => {
        setRoomToDelete(room);
    };

    const confirmDelete = async () => {
        if (!roomToDelete) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/rooms/${roomToDelete._id}`);
            setRooms(prevRooms => prevRooms.filter(room => room._id !== roomToDelete._id));
            setRoomToDelete(null);
        } catch (error) {
            alert('Failed to delete room.');
            setRoomToDelete(null);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">StudySync Dashboard</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition"
                >
                    + Create Room
                </button>
            </div>

            {loading && <p className="text-gray-400">Loading rooms...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <RoomList 
                    rooms={rooms} 
                    user={user} 
                    onDeleteClick={handleDeleteClick} 
                />
            )}

            <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateRoom}
            />

            <DeleteConfirmationModal
                isOpen={!!roomToDelete}
                onClose={() => setRoomToDelete(null)}
                onConfirm={confirmDelete}
                roomName={roomToDelete?.name}
            />
        </div>
    );
}
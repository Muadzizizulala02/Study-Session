import { Link } from 'react-router-dom';

export default function RoomList({ rooms, user, onDeleteClick }) {
    if (!rooms || rooms.length === 0) {
        return <p className="text-gray-400">No study rooms available. Create one to get started!</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
                <div key={room._id} className="bg-gray-800 rounded-lg shadow-lg p-5 flex flex-col justify-between transition hover:shadow-blue-500/20 hover:-translate-y-1">
                    <div>
                        <h3 className="text-xl font-bold text-white">{room.name}</h3>
                        <p className="text-gray-400 mt-2 h-12 overflow-hidden">{room.description || 'No description available.'}</p>
                        <p className="text-sm text-gray-500 mt-4">
                            Created by: <span className="font-semibold text-blue-400">{room.createdBy?.username || 'Unknown'}</span>
                        </p>
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                        <Link
                            to={`/study-room/${room._id}`}
                            className="w-full text-center inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
                        >
                            Join Room
                        </Link>
                        {/* --- CREATOR-ONLY DELETE BUTTON --- */}
                        {user && room.createdBy._id === user._id && (
                            <button
                                onClick={() => onDeleteClick(room)}
                                className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                title="Delete Room"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
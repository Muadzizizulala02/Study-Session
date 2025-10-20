// client/src/components/CreateRoomModal.jsx

import { useState } from 'react';

export default function CreateRoomModal({ isOpen, onClose, onCreate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return; // Basic validation
        onCreate({ name, description });
        // Reset fields and close modal
        setName('');
        setDescription('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">Create a New Study Room</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="room-name" className="block text-gray-300 mb-2">Room Name</label>
                        <input
                            id="room-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="room-description" className="block text-gray-300 mb-2">Description (Optional)</label>
                        <textarea
                            id="room-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="py-2 px-5 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500">
                            Cancel
                        </button>
                        <button type="submit" className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                            Create Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
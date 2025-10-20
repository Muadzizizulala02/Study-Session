import React from 'react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, roomName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                <p className="text-gray-300 mb-6">
                    Are you sure you want to permanently delete the room "<span className="font-semibold text-red-400">{roomName}</span>"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onClose} 
                        className="py-2 px-5 bg-gray-600 font-semibold rounded-md hover:bg-gray-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="py-2 px-5 bg-red-600 font-semibold rounded-md hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
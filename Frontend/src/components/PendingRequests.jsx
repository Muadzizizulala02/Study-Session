import React from 'react';

export default function PendingRequests({ requests, onApprove }) {
    if (!requests || requests.length === 0) {
        return null; // Don't render anything if there are no requests
    }

    return (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pending Join Requests</h3>
            <div className="space-y-3">
                {requests.map(user => (
                    <div key={user._id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                        <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                            <span className="text-white">{user.username}</span>
                        </div>
                        <button
                            onClick={() => onApprove(user._id)}
                            className="bg-green-500 text-white font-semibold text-sm py-1 px-3 rounded-md hover:bg-green-600 transition-colors"
                        >
                            Approve
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
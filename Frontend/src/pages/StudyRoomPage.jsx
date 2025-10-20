import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

// Component Imports
import ChatWindow from '../components/ChatWindow';
import NotesEditor from '../components/NotesEditor';
import PendingRequests from '../components/PendingRequests';

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5001";

export default function StudyRoomPage() {
    const { id: roomId } = useParams();
    const { user } = useAuth();
    const socketRef = useRef();
    const debounceTimeout = useRef(null);

    const [room, setRoom] = useState(null);
    const [accessStatus, setAccessStatus] = useState('loading');
    const [messages, setMessages] = useState([]);
    const [notes, setNotes] = useState('');

    const fetchRoomData = useCallback(async () => {
        // No need to set loading here, it's handled by the approval flow
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/rooms/${roomId}`);
            setRoom(data);
            setNotes(data.notes);
            setMessages(data.chatHistory || []);
            setAccessStatus(data.createdBy._id === user._id ? 'owner' : 'member');
        } catch (error) {
            if (error.response?.status === 403) {
                setRoom(error.response.data.roomInfo);
                setAccessStatus(error.response.data.roomInfo.isPending ? 'pending' : 'denied');
            } else {
                setAccessStatus('error');
            }
        }
    }, [roomId, user]);

    useEffect(() => {
        if (user) fetchRoomData();
    }, [user, fetchRoomData]);

    // --- RESTRUCTURED SOCKET CONNECTION & LISTENERS ---
    useEffect(() => {
        if (!user) return;
        
        const socket = io(SOCKET_SERVER_URL);
        socketRef.current = socket;
        socket.emit('joinRoom', roomId);

        // --- The universal listener for requesters ---
        // Every user who lands on this page will listen for this event.
        socket.on('requestApproved', ({ userId }) => {
            if (userId === user._id) {
                // My request was just approved! Re-fetch data to get full access.
                fetchRoomData();
            }
        });

        // --- Member-only listeners ---
        // Only set these up if the user is already a member or owner.
        if (accessStatus === 'member' || accessStatus === 'owner') {
            socket.on('chatMessage', (message) => setMessages((prev) => [...prev, message]));
            socket.on('noteUpdate', (content) => setNotes(content));
        }
        
        // --- Owner-only listener ---
        if (accessStatus === 'owner') {
            socket.on('newJoinRequest', (newRequestUser) => {
                setRoom(prevRoom => {
                    // Avoid adding duplicate requests if event fires multiple times
                    if (!prevRoom.joinRequests.find(req => req._id === newRequestUser._id)) {
                        return { ...prevRoom, joinRequests: [...prevRoom.joinRequests, newRequestUser] };
                    }
                    return prevRoom;
                });
            });
        }
        
        return () => socket.disconnect();
    }, [roomId, user, accessStatus, fetchRoomData]);

    // --- ACTION HANDLERS ---
    const handleRequestJoin = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/rooms/${roomId}/request-join`);
            setAccessStatus('pending'); // This now works without a blank screen
        } catch (error) {
            alert('Could not send join request. You may have already requested.');
        }
    };

    const handleApprove = async (userIdToApprove) => {
        try {
            const { data: updatedRequests } = await axios.post(`${import.meta.env.VITE_API_URL}/rooms/${roomId}/approve-join`, { userIdToApprove });
            setRoom(prevRoom => ({...prevRoom, joinRequests: updatedRequests}));
        } catch (error) { console.error('Failed to approve request:', error); }
    };
    
    const handleSendMessage = async (text) => {
        if (!user || !text.trim() || !socketRef.current) return;
        const message = { user, text };
        setMessages((prev) => [...prev, message]);
        socketRef.current.emit('chatMessage', { roomId, message });
        await axios.post(`${import.meta.env.VITE_API_URL}/rooms/${roomId}/messages`, { text });
    };

    const handleNoteChange = (content) => {
        if (!socketRef.current) return;
        setNotes(content);
        socketRef.current.emit('noteUpdate', { roomId, content });
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            axios.put(`${import.meta.env.VITE_API_URL}/rooms/${roomId}/notes`, { notes: content });
        }, 1000);
    };

    // --- CONDITIONAL UI RENDERING ---
    if (accessStatus === 'loading') return <div className="text-white text-center p-10 text-lg">Loading Room...</div>;
    
    if (accessStatus === 'error') return <div className="text-red-500 text-center p-10 text-lg">Error loading room.</div>;

    if (accessStatus === 'denied' || accessStatus === 'pending') {
        return (
            <div className="container mx-auto text-center p-10 flex flex-col items-center">
                <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl text-white font-bold mb-2">Room: {room?.name}</h1>
                    <p className="text-gray-400 mb-6">Created by {room?.createdBy}</p>
                    {accessStatus === 'denied' ? (
                        <button onClick={handleRequestJoin} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 w-full">
                            Request to Join
                        </button>
                    ) : (
                        <p className="text-yellow-400 font-semibold text-lg bg-yellow-900/50 py-3 rounded-md">Your request is pending.</p>
                    )}
                </div>
            </div>
        );
    }
    
    if (accessStatus === 'owner' || accessStatus === 'member') {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-white mb-4">Room: <span className="text-blue-400">{room.name}</span></h1>
                {accessStatus === 'owner' && <PendingRequests requests={room.joinRequests} onApprove={handleApprove} />}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4" style={{ height: 'calc(100vh - 220px)' }}>
                    <div className="lg:col-span-2 h-full"><NotesEditor content={notes} onNoteChange={handleNoteChange} /></div>
                    <div className="h-full"><ChatWindow messages={messages} onSendMessage={handleSendMessage} user={user} /></div>
                </div>
            </div>
        );
    }
}
import { useState, useRef, useEffect } from 'react';

export default function ChatWindow({ messages, onSendMessage, user }) {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-800 rounded-lg p-4 shadow-inner">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Room Chat</h3>
            <div className="flex-1 overflow-y-auto mb-4 pr-2">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-3 flex ${msg.user.username === user.username ? 'justify-end' : 'justify-start'}`}>
                        <div className={`inline-block p-2 rounded-lg max-w-xs ${msg.user.username === user.username ? 'bg-blue-600' : 'bg-gray-700'}`}>
                            <div className="text-xs text-gray-400 font-semibold">{msg.user.username}</div>
                            <p className="text-white break-words">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </form>
        </div>
    );
}

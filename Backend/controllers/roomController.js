const Room = require('../models/Room');

// --- UNCHANGED FUNCTIONS ---
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({}).populate('createdBy', 'username avatar').sort({ createdAt: -1 });
        res.json(rooms);
    } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

const createRoom = async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Please provide a room name' });
    try {
        const room = new Room({ name, description, createdBy: req.user._id, members: [req.user._id] });
        const createdRoom = await room.save();
        res.status(201).json(createdRoom);
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: 'A room with this name already exists.' });
        res.status(500).json({ message: "Server Error" });
    }
};

const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('members', 'username avatar')
            .populate('chatHistory.user', 'username avatar')
            .populate('createdBy', 'username avatar');
        if (!room) return res.status(404).json({ message: 'Room not found' });
        const isMember = room.members.some(member => member._id.equals(req.user._id));
        if (!isMember) {
            return res.status(403).json({
                message: 'Access Denied',
                roomInfo: { name: room.name, createdBy: room.createdBy.username, isPending: room.joinRequests.some(userId => userId.equals(req.user._id)) }
            });
        }
        if (room.createdBy._id.equals(req.user._id)) {
            await room.populate('joinRequests', 'username avatar');
        }
        res.json(room);
    } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

const updateRoomNotes = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        room.notes = req.body.notes || room.notes;
        await room.save();
        res.json({ notes: room.notes });
    } catch (error) { res.status(500).json({ message: "Server Error" }); }
};

const addChatMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        const newMessage = { user: req.user._id, text: text };
        room.chatHistory.push(newMessage);
        await room.save();
        res.status(201).json({ message: 'Message saved' });
    } catch (error) { res.status(500).json({ message: 'Server error while adding message' }); }
};

const requestToJoinRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        if (room.joinRequests.includes(req.user._id) || room.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'Request already sent or you are already a member.' });
        }
        room.joinRequests.push(req.user._id);
        await room.save();
        const newRequestUser = { _id: req.user._id, username: req.user.username, avatar: req.user.avatar };
        req.io.to(req.params.id).emit('newJoinRequest', newRequestUser);
        res.status(200).json({ message: 'Join request sent successfully.' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const approveJoinRequest = async (req, res) => {
    try {
        const { userIdToApprove } = req.body;
        const room = await Room.findById(req.params.id);
        if (!room.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized.' });
        room.joinRequests = room.joinRequests.filter(userId => !userId.equals(userIdToApprove));
        if (!room.members.includes(userIdToApprove)) room.members.push(userIdToApprove);
        await room.save();
        req.io.to(req.params.id).emit('requestApproved', { userId: userIdToApprove });
        await room.populate('joinRequests', 'username avatar');
        res.status(200).json(room.joinRequests);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
// --- END OF UNCHANGED FUNCTIONS ---


// --- NEW: Function to delete a room ---
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // --- SECURITY CHECK ---
        if (!room.createdBy.equals(req.user._id)) {
            return res.status(401).json({ message: 'Not authorized to delete this room' });
        }

        await room.deleteOne();

        res.json({ message: 'Room removed successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = { 
    getRooms, createRoom, getRoomById, updateRoomNotes, addChatMessage,
    requestToJoinRoom, approveJoinRequest,
    deleteRoom // <-- Export the new function
};
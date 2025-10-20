const express = require('express');
const { 
    getRooms, 
    createRoom, 
    getRoomById, 
    updateRoomNotes, 
    addChatMessage,
    requestToJoinRoom, 
    approveJoinRequest,
    deleteRoom // <-- Import the new function
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getRooms).post(protect, createRoom);

// --- MODIFIED ROUTE ---
// Chain the new DELETE method to the existing route for /:id
router.route('/:id')
    .get(protect, getRoomById)
    .delete(protect, deleteRoom); // <-- Add this line

router.route('/:id/notes').put(protect, updateRoomNotes);
router.route('/:id/messages').post(protect, addChatMessage);
router.route('/:id/request-join').post(protect, requestToJoinRoom);
router.route('/:id/approve-join').post(protect, approveJoinRequest);

module.exports = router;
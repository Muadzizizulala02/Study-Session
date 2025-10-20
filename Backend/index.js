const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const Room = require('./models/Room');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// --- 1. Define your allowed origins (whitelist) ---
const allowedOrigins = [
    'http://localhost:5173', // For your local development
    'https://study-session-ten.vercel.app' // Your deployed frontend URL
];

// --- 2. Create the more robust CORS options ---
const corsOptions = {
    origin: function (origin, callback) {
        // Check if the incoming origin is in our whitelist
        // The '!origin' part allows requests from tools like Postman
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('This origin is not allowed by CORS policy.'));
        }
    }
};

const io = new Server(server, {
    cors: corsOptions // Use the same options for Socket.io
});

// --- 3. Use the new CORS options in your Express app ---
app.use(cors(corsOptions));
app.use(express.json());


// Middleware to attach io to requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

// API Routes
app.get("/", (req,res) => {
    res.send("The StudySync API is running correctly.");
});
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

// Real-Time Socket.io Logic
io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);
    socket.on('joinRoom', (roomId) => socket.join(roomId));
    socket.on('chatMessage', ({ roomId, message }) => socket.to(roomId).emit('chatMessage', message));
    socket.on('noteUpdate', ({ roomId, content }) => socket.to(roomId).emit('noteUpdate', content));
    socket.on('disconnect', () => console.log(`Client disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
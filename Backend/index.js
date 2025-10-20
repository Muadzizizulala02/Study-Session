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

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Your frontend URL
        methods: ['GET', 'POST'],
    },
});

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// --- NEW MIDDLEWARE TO ATTACH io TO REQUESTS ---
// This makes the `io` instance available in all API route handlers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// --- API Routes ---
app.get("/", (req,res) => {
    res.send("The StudySync API is running correctly.");
});
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);

// --- Real-Time Socket.io Logic ---
io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('chatMessage', ({ roomId, message }) => {
        socket.to(roomId).emit('chatMessage', message);
    });

    socket.on('noteUpdate', ({ roomId, content }) => {
        socket.to(roomId).emit('noteUpdate', content);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
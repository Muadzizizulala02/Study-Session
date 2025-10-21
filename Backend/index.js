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

// --- Define your complete list of allowed origins ---
const allowedOrigins = [
    'http://localhost:5173',                  // For local development
    'https://study-session-ten.vercel.app',   // Your Vercel subdomain
    'http://www.studysynchro.online',         // Your new custom domain (with http)
    'https://www.studysynchro.online'          // Your new custom domain (with https)
];

const corsOptions = {
    origin: function (origin, callback) {
        // The '!origin' allows server-to-server requests or tools like Postman
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('This origin is not allowed by CORS policy.'));
        }
    }
};

const io = new Server(server, { cors: corsOptions });

app.use(cors(corsOptions));
app.use(express.json());

// Middleware to make `io` accessible in route controllers
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

// --- Real-Time Logic ---
io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // When a user connects and enters a specific room page
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // When a chat message is sent by a client
    socket.on('chatMessage', ({ roomId, message }) => {
        // Broadcast the message to all other clients in that room
        socket.to(roomId).emit('chatMessage', message);
    });

    // When the shared notes are updated by a client
    socket.on('noteUpdate', ({ roomId, content }) => {
        // Broadcast the new notes content to all other clients in that room
        socket.to(roomId).emit('noteUpdate', content);
    });

    // When a client disconnects
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

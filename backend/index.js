const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');

const JWT_SECRET = process.env.JWT_SECRET || 'ebench_jwt_secret_change_in_production';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ebench';

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// JWT middleware for protected REST routes
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

// JWT authentication for Socket.IO connections
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required.'));
  try {
    socket.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    next(new Error('Invalid or expired token.'));
  }
});

const rooms = new Map(); // roomId → { lawyer, user }

// REST: Create a room (lawyer initiates)
app.get('/create-room', (req, res) => {
  const roomId = uuidv4();
  rooms.set(roomId, { lawyer: null, user: null });
  res.json({ roomId });
});

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // Join room with role
  socket.on('join-room', ({ roomId, role }) => {
    if (!rooms.has(roomId)) rooms.set(roomId, {});
    const room = rooms.get(roomId);
    room[role] = socket.id;
    socket.join(roomId);
    socket.data = { roomId, role };

    // Notify other peer
    socket.to(roomId).emit('peer-joined', { role, socketId: socket.id });
    console.log(`${role} joined room ${roomId}`);
  });

  // WebRTC Signaling
  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', { offer, from: socket.id });
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', { candidate });
  });

  // Chat messages
  socket.on('chat-message', ({ roomId, message, sender }) => {
    io.to(roomId).emit('chat-message', { message, sender, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    const { roomId, role } = socket.data || {};
    if (roomId) socket.to(roomId).emit('peer-left', { role });
  });
});

server.listen(4000, () => console.log('Signaling server on :4000'));
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
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
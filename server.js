const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get('/api/get-qr', async (req, res) => {
  const sessionId = "session_" + Date.now();
  const qrImage = await QRCode.toDataURL(sessionId);
  res.json({ sessionId, qrImage });
});
app.post('/api/scan', (req, res) => {
  const { sessionId, user } = req.body;
  io.to(sessionId).emit('loggedIn', { user });
  res.json({ success: true });
});
io.on('connection', (socket) => {
  socket.on('join', (sessionId) => { socket.join(sessionId); });
});
server.listen(PORT, () => { console.log('Server চলছে port '+PORT); });

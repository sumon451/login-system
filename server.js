const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.get('/', (req, res) => {
  res.send('Server is Running! QR Login Ready');
});

app.get('/scan/:id', (req, res) => {
  const sessionId = req.params.id;
  io.emit('logged-in', sessionId);
  // এই পেজটা অন্য ফোনে ওপেন হবে স্ক্যান করলে
  res.send(`
    <h2 style="text-align:center;margin-top:50px;font-family:sans-serif">✅ Login Successful!</h2>
    <p style="text-align:center">আপনি লগইন করে ফেলেছেন, কম্পিউটারে দেখুন</p>
    <script>
      setTimeout(()=>{ window.close(); }, 2000);
    </script>
  `);
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('create-session', (sessionId) => {
    socket.join(sessionId);
    console.log('Session created:', sessionId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

io.on('logged-in', (sessionId) => {
    // This is handled via GET route now
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

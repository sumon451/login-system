const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get('/', (req, res) => res.send('Server OK'));
app.get('/scan/:id', (req, res) => {
  io.emit('logged-in', req.params.id);
  res.send('<h1 style="text-align:center;margin-top:100px">✅ Login Success! PC te dekho</h1>');
});

io.on('connection', (socket) => {
  socket.on('create-session', (id) => socket.join(id));
});

server.listen(process.env.PORT || 3000);

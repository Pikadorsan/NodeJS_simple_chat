const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const connections = [];
const users = [];

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('setUsername', (data) => {
    const { username } = data;
    socket.username = username;
    users.push(username);
    io.emit('userList', users);
  });

  connections.push(socket);

  // Obsługa wiadomości od klienta
  socket.on('message', (message) => {
    console.log('Message:', message);

    if (message.startsWith('/pw ')) {
      const messageParts = message.split(' ');
      const recipient = messageParts[1];
      const privateMessage = messageParts.slice(2).join(' ');

      const recipientSocket = connections.find(
        (clientSocket) => clientSocket.username === recipient
      );

      if (recipientSocket) {
        socket.emit('message', {
          username: `Private message to ${recipient}`,
          message: privateMessage,
          sent: true
        });
        recipientSocket.emit('message', {
          username: `Private message from ${socket.username}`,
          message: privateMessage,
          sent: false
        });
      } else {
        socket.emit('message', {
          username: 'Server',
          message: `User ${recipient} not found`,
          sent: true
        });
      }
    } else {
      const newMessage = {
        username: socket.username,
        message: message,
        sent: true
      };

      socket.emit('message', newMessage);
      socket.broadcast.emit('message', {
        ...newMessage,
        sent: false
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);

    const index = connections.indexOf(socket);
    if (index !== -1) {
      connections.splice(index, 1);
    }

    if (socket.username) {
      const userIndex = users.indexOf(socket.username);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        io.emit('userList', users);
      }
    }
  });

  socket.emit('userList', users);
});

server.listen(3000, () => {
  console.log('App is running at http://localhost:3000');
});

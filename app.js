


// Importowanie modułów
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Inicjalizacja aplikacji Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Tablica, w której przechowujemy połączenia użytkowników
const connections = [];
const users = [];

// Ustawienie silnika widoku EJS
app.set('view engine', 'ejs');

// Dodanie obsługi żądania GET dla głównego adresu URL
app.get('/', (req, res) => {
  res.render('index');
});

// Definicja obsługi połączenia z klientem
io.on('connection', (socket) => {
  console.log('Nowe połączenie:', socket.id);

  // Obsługa ustawienia imienia użytkownika
  socket.on('setUsername', (data) => {
    const { username } = data;
    socket.username = username;
    users.push(username);
    io.emit('userList', users);
  });

  // Dodajemy połączenie do tablicy
  connections.push(socket);

  // Obsługa wiadomości od klienta
  socket.on('message', (message) => {
    console.log('Wiadomość:', message);

    // Przesyłamy wiadomość do wszystkich podłączonych klientów (oprócz nadawcy)
    connections.forEach((clientSocket) => {
      if (clientSocket !== socket) {
        clientSocket.emit('message', {
          username: socket.username,
          message: message
        });
      }
    });
  });

  // Obsługa rozłączenia klienta
  socket.on('disconnect', () => {
    console.log('Rozłączono:', socket.id);

    // Usuwamy połączenie z tablicy
    const index = connections.indexOf(socket);
    if (index !== -1) {
      connections.splice(index, 1);
    }

    // Usuwamy użytkownika z listy
    if (socket.username) {
      const userIndex = users.indexOf(socket.username);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        io.emit('userList', users);
      }
    }
  });

  // Przesyłamy aktualną listę użytkowników do nowo połączonego klienta
  socket.emit('userList', users);
});

// Uruchomienie serwera na porcie 3000
server.listen(3000, () => {
  console.log('Aplikacja działa na http://localhost:3000');
});

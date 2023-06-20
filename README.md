# NodeJS simple chat
This is a real-time chat application built using WebSocket technology. It allows users to communicate with each other instantly.

# Installation

To run the WebSocket chat application locally, you'll need to perform the following steps:

1. Clone the repository:
git clone <repository_url>

2. Navigate to the project directory:
cd websocket-chat

3. Install the dependencies using npm:
npm install

# Server
The server-side of the application is implemented using JavaScript and the Express.js framework. The WebSocket protocol is used for real-time communication, using the `ws` library instead of Socket.io.

-  The server creates an HTTP server using the http module and listens on a specified port.
- WebSocket connections and logged-in users are stored in two main arrays: connections and users.
- The main page (/) is rendered using the EJS template engine.
- WebSocket connections are handled in the io.on('connection', ...) function.
- Upon connection, the user provides their name, which is added to the list of logged-in users (users)
- The server listens for the 'setUsername' event to set the user's name.
- Messages received from clients are checked to determine if they are private messages or public messages.
- Private messages are sent only to the intended recipient.
- Public messages are broadcasted to all connected clients except the sender.
- The server handles the 'disconnect' event, which occurs when a client disconnect.
- On disconnection, the client is removed from the connections array, and if they were logged in, they are also removed from the users list.
- The updated user list is emitted to all clients using the 'userList' event.



# Client
The client-side of the application is a web page that communicates with the server using WebSocket.


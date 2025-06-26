const http = require("http");
const { Server } = require("socket.io");
const app = require("./app"); // the express app
// const registerSockets = require("./socketAlt");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://jiggasha.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require("./socket/battle")(io);


// // Attach socket events
// registerSockets(io);

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

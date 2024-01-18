import env from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import routes from './routes';
import handleSockets from './sockets';

env.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Use routes
app.use('/', routes);

// Use sockets
handleSockets(io);

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log('Listening at PORT', PORT);
});

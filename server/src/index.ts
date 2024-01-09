import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { ESocketActions } from '../../SocketActions';

import env from 'dotenv';
env.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(__dirname + '/index.html');
});

io.on(ESocketActions.CONNECTION, (socket: Socket) => {
  console.log('a user connected', socket.id);
  // On Join
  socket.on(ESocketActions.JOIN, () => {
    console.log('user joined');
  });

  socket.on(ESocketActions.ON_CODE_CHANGE, (data) => {
    io.emit(ESocketActions.ON_CODE_CHANGE, data);
  });

  // On Disconnect
  socket.on(ESocketActions.DISCONNECT, () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log('Listening at PORT', PORT);
});

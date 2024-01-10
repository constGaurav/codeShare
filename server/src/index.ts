import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { ESocketActions } from './SocketActions';

import env from 'dotenv';
env.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Code share application',
    author: 'Gaurav Chaudhary',
  });
});

// User Socket Mapping
const userSocketMap: Record<string, string> = {};

const getAllConnectedUsers = (roomId: string) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on('connection', (socket: Socket) => {
  // 1. On Join
  socket.on(ESocketActions.JOIN, ({ roomId, username }: any) => {
    userSocketMap[socket.id] = username;

    // create/join room
    socket.join(roomId);

    // emit joined
    const users = getAllConnectedUsers(roomId);
    users.forEach(({ socketId }) => {
      io.to(socketId).emit(ESocketActions.JOINED, {
        users,
        username,
        socketId: socket.id,
      });
    });
  });

  // 2. On Code Change
  socket.on(ESocketActions.ON_CODE_CHANGE, ({ roomId, code }: any) => {
    socket.in(roomId).emit(ESocketActions.ON_CODE_CHANGE, {
      code,
    });
  });

  // 3. handle code sync for new users
  socket.on(ESocketActions.CODE_SYNC, ({ socketId, code }: any) => {
    io.to(socketId).emit(ESocketActions.ON_CODE_CHANGE, { code });
  });

  // 4. On Disconnect
  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ESocketActions.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
      socket.leave(roomId);
    });
    delete userSocketMap[socket.id];
  });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
  console.log('Listening at PORT', PORT);
});

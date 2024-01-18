import { Server, Socket } from 'socket.io';
import { ESocketActions } from '../SocketActions';

// User Socket Mapping
const userSocketMap: Record<string, string> = {};

const getAllConnectedUsers = (roomId: string, io: Server) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

const handleSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    // 1. On Join
    socket.on(ESocketActions.JOIN, ({ roomId, username }: any) => {
      userSocketMap[socket.id] = username;

      // create/join room
      socket.join(roomId);

      // emit joined
      const users = getAllConnectedUsers(roomId, io);
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
};

export default handleSockets;

import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3001'; // TODO: move to .env and then use

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempts: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
  };

  return io(BACKEND_URL, options as any);
};

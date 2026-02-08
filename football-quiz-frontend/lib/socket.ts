import { io } from 'socket.io-client';

export const socket = io('http://13.209.87.175:4000', {
  withCredentials: true,
  transports: ['websocket'],
  autoConnect: false,
});
import { SocketIO } from '@flutry/fastify';

export const sendRoom = (room: string, event: string, payload: any) => {
  SocketIO.io.to(room).emit(event, payload);
};

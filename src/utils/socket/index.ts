import { SocketIO } from '@flutry/fastify';
import { FlutryLogger } from '@flutry/main';

SocketIO.io.on('connection', (socket: any) => {
  FlutryLogger.getLogger().info('Connect ' + socket.id);
  socket.on('disconnect', () => {
    FlutryLogger.getLogger().info('Disconnect ' + socket.id);
  });
});

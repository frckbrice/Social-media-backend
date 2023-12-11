import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: 'messages';
      server: any;
    },
  ) {
    const server = super.createIOServer(3002, { ...options, cors: true });
    return server;
  }
}

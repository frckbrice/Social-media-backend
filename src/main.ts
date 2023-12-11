import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { WsAdapter } from '@nestjs/platform-ws';
import { SocketAdapter } from './socketAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // app.useWebSocketAdapter(new SocketAdapter(app));
  await app.listen(3001);
}
bootstrap();

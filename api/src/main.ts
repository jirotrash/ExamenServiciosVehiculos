import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Añadir prefijo global para coincidir con el cliente (ej. /api/dsm44/...)
  app.setGlobalPrefix('api/dsm44');

  // Habilitar CORS para desarrollo: permitir peticiones desde la UI local (web/Expo)
  // Ajusta o restringe los orígenes antes de pasar a producción.
  app.enableCors({
    origin: [
      'http://localhost:8081', // react-native-web / Expo web dev
      'http://localhost:19006', // Expo default web port
      'http://localhost:8080',  // otras posibles dev origins
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();

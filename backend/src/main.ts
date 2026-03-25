import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS configuration for production
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'http://tasksmanager.mardomi.org',
      'https://tasksmanager.mardomi.org',
      'http://api.tasksmanager.mardomi.org',
      'https://api.tasksmanager.mardomi.org',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();

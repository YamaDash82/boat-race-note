import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const devMode = (process.env.DEV_MODE || "") === "1";

  const app = await NestFactory.create(AppModule, {
    cors: devMode ? { 
      origin: [
        'http://localhost:4200', 
        'http://localhost:9876', 
      ],
    } : undefined,  
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

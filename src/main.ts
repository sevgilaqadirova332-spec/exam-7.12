import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // DTO da yo'q fieldlarni o'chiradi
      forbidNonWhitelisted: true, // ruxsatsiz fieldlar xato qaytaradi
      transform: true,       // string -> number kabi o'giradi
    }),
  );

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Ishga Joylashish Platformasi API')
    .setDescription('hh.uz ga o\'xshash platforma — Auth moduli')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); 

  await app.listen(3000);
   console.log('🚀 Server ishga tushdi: http://localhost:3000');
  console.log('📄 documentation link: http://localhost:3000/api/docs');
}
bootstrap();

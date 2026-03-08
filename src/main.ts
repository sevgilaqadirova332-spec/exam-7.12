import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            
      forbidNonWhitelisted: true, 
      transform: true,        
    }),
  );

  app.enableCors();

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Xorazm Jobs API')
    .setDescription(
      `
## Xorazm viloyati uchun ishga joylashish platformasi

### Asosiy funksiyalar:
- 👤 **Auth** — ro'yxatdan o'tish, kirish, profil
- 🏢 **Kompaniyalar** — yaratish, tahrirlash, ko'rish
- 💼 **Vakansiyalar** — e'lon berish, qidirish, filtrlash  
- 📄 **Rezyumeler** — yaratish, ko'rish
- 🏷️ **Kategoriyalar** — IT, qurilish, tibbiyot va boshqalar

### Autentifikatsiya:
1. \`POST /api/v1/auth/register\` — ro'yxatdan o'ting
2. \`POST /api/v1/auth/login\` — token oling
3. "Authorize" tugmasini bosing va tokenni kiriting: \`Bearer <token>\`
      `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addTag('Auth', 'Autentifikatsiya va avtorizatsiya')
    .addTag('Users', 'Foydalanuvchilar')
    .addTag('Companies', 'Kompaniyalar')
    .addTag('Vacancies', 'Vakansiyalar (ish o\'rinlari)')
    .addTag('Resumes', 'Rezyumeler')
    .addTag('Categories', 'Ish kategoriyalari')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Sahifani yangilaganda token saqlanadi
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('\n========================================');
  console.log(`🚀  Server:  http://localhost:${port}`);
  console.log(`📄  Swagger: http://localhost:${port}/api/docs`);
  console.log(`🌐  API:     http://localhost:${port}/api/v1`);
  console.log('========================================\n');
}

bootstrap();

/**
 * SEED — Namunali ma'lumotlar kiritish
 * Ishlatish: npm run seed
 */
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'xorazm_jobs',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Seed boshlandi...');

  // Kategoriyalar
  await AppDataSource.query(`
    INSERT INTO categories (name, slug, icon, description) VALUES
    ('IT va Dasturlash', 'it-dasturlash', '💻', 'Dasturchi, dizayner, tester'),
    ('Qurilish', 'qurilish', '🏗️', 'Muhandis, usta, prораб'),
    ('Tibbiyot', 'tibbiyot', '🏥', 'Shifokor, hamshira, aptekar'),
    ('Ta''lim', 'talim', '📚', 'O''qituvchi, repetitor, murabbiy'),
    ('Savdo va Marketing', 'savdo', '🛒', 'Menejer, sotuvchi, SMM'),
    ('Transport va Logistika', 'transport', '🚚', 'Haydovchi, ekspeditor, omborchi'),
    ('Moliya va Buxgalteriya', 'moliya', '💰', 'Buxgalter, moliyachi, auditor'),
    ('Xizmat ko''rsatish', 'xizmat', '🤝', 'Ofitsiant, kassir, xizmatkor')
    ON CONFLICT (slug) DO NOTHING;
  `);
  console.log('✅ Kategoriyalar qo\'shildi');

  // Admin foydalanuvchi
  const adminPass = await bcrypt.hash('Admin@123', 10);
  await AppDataSource.query(`
    INSERT INTO users (email, password, "firstName", "lastName", phone, role, city, "isEmailVerified")
    VALUES ('admin@xorazmjobs.uz', '${adminPass}', 'Admin', 'Xorazm', '+998953484246', 'admin', 'Urganch', true)
    ON CONFLICT (email) DO NOTHING;
  `);
  console.log('✅ Admin yaratildi: admin@xorazmjobs.uz / Admin@123');

  // Namunali employer
  const empPass = await bcrypt.hash('Employer@123', 10);
  await AppDataSource.query(`
    INSERT INTO users (email, password, "firstName", "lastName", phone, role, city)
    VALUES ('hr@xorazm-tech.uz', '${empPass}', 'Sarvinoz', 'Yusupova', '+998953484246', 'employer', 'Urganch')
    ON CONFLICT (email) DO NOTHING;
  `);
  console.log('✅ Employer yaratildi: hr@xorazm-tech.uz / Employer@123');

  await AppDataSource.destroy();
  console.log('\n🎉 Seed muvaffaqiyatli tugadi!');
  console.log('📄 Swagger: http://localhost:3000/api/docs');
}

seed().catch(console.error);

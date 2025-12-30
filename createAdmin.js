import bcrypt from 'bcrypt';
import User from './src/app/models/User.js';
import './src/database/index.js';

async function createAdmin() {
  try {
    const password_hash = await bcrypt.hash('123456', 10);

    const admin = await User.create({
      name: 'Admin Inicial',
      email: 'admin@devburguer.com',
      password_hash,
      admin: true
    });

    console.log('✅ Admin criado com sucesso!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Senha: 123456');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
    process.exit(1);
  }
}

createAdmin();

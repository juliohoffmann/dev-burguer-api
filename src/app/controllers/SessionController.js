import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sessionCreateSchema } from '../schemas/SessionSchema.js';

class SessionController {
  async store(request, response) {
    try {
      const { email, password_hash } = request.body;

      // Valida com Yup
      await sessionCreateSchema.validate({ email, password_hash });

      // Busca o usuário pelo email
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return response.status(401).json({ 
          message: 'Email ou senha incorretos!' 
        });
      }

      // Compara a senha digitada com o hash armazenado
      const passwordMatch = await bcrypt.compare(password_hash, user.password_hash);

      if (!passwordMatch) {
        return response.status(401).json({ 
          message: 'Email ou senha incorretos!' 
        });
      }

      // Gera o token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'seu_secret_key_aqui',
        { expiresIn: '7d' }
      );

      return response.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          admin: user.admin,
        },
      });
    } catch (error) {
      return response.status(400).json({ 
        message: error.message 
      });
    }
  }
}

export default new SessionController();

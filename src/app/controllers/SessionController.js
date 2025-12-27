import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js'; // Mantenha APENAS esta linha
import User from '../models/User.js';
import bcrypt from 'bcrypt'; // Adicione esta importação, pois 'bcrypt' está sendo usado mas não importado

// Defina o schema de validação para a sessão (login)
const sessionCreateSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  password: Yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres'), // Use 'password' conforme suas memórias
});

class SessionController {
  async store(request, response) {
    try {
      // Julio's endpoint de sessão agora usa o campo "password" ao comparar senhas
      const { email, password } = request.body; // Use 'password' em vez de 'password_hash' aqui

      // Valida com Yup
      await sessionCreateSchema.validate({ email, password }); // Valida com 'password'

      // Busca o usuário pelo email
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return response.status(401).json({
          message: 'Email ou senha incorretos!',
        });
      }

      // Compara a senha digitada com o hash armazenado
      // Julio's SessionController valida login, checks password_hash
      const passwordMatch = await bcrypt.compare(password, user.password_hash); // Compara 'password' com 'user.password_hash'

      if (!passwordMatch) {
        return response.status(401).json({
          message: 'Email ou senha incorretos!',
        });
      }

      // Gera o token JWT COM admin
      // Julio's SessionController returns user (id, name, email, admin) and JWT signed with authConfig secret/expiresIn
      // Julio's endpoint de sessão agora usa o campo "password" ao comparar senhas e gera token JWT com id, email e admin.
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          admin: user.admin, // ✅ ADICIONE AQUI
        },
        authConfig.secret, // Use authConfig.secret conforme suas memórias
        { expiresIn: authConfig.expiresIn } // Use authConfig.expiresIn conforme suas memórias
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
      // Julio's SessionController logs errors.
      console.error('Erro no SessionController.store:', error); // Adicionado log para depuração
      return response.status(400).json({
        message: error.message,
      });
    }
  }
}

export default new SessionController();

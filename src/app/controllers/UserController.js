import * as Yup from 'yup'; // Adicione esta importação
import bcrypt from 'bcrypt';
import User from '../models/User.js';

// Schema de validação para criação de usuário
const userCreateSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  password: Yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter no mínimo 6 caracteres'),
  admin: Yup.boolean().default(false), // admin boolean (default false)
});

class UserController {
  async store(request, response) {
    try {
      // Valida com userCreateSchema
      await userCreateSchema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = request.body;

    const userExists = await User.findOne({
      where: { email },
    });

    if (userExists) {
      return response.status(409).json({ error: 'User already exists' });
    }

    // Gera hash com bcrypt para a senha
    const password_hash = await bcrypt.hash(password, 10); // Julio's UserController gera hash com bcrypt

    // CRUCIAL: NÃO inclua 'id' aqui. Deixe o banco de dados gerá-lo automaticamente.
    const user = await User.create({
      name,
      email,
      password_hash, // Usa password_hash conforme o modelo de Julio
      admin: admin || false, // Garante que admin seja boolean e default false
    });

    // Retorne os dados do usuário, excluindo password_hash das respostas
    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    });
  }

  // ... (outros métodos como update, index)
  // Se você tiver outros métodos, como update, eles também precisarão do Yup e do bcrypt
  // e devem usar userUpdateSchema e excluir password_hash das respostas.
}

export default new UserController();

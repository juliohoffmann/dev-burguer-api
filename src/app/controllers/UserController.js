// src/app/controllers/UserController.js

import * as Yup from 'yup'; // Para validação
import User from '../models/User.js'; // Seu modelo de usuário
import bcrypt from 'bcrypt'; // Para hashing de senha

class UserController {
  async store(request, response) {
    // 1. Definir o schema de validação para criação de usuário
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome é obrigatório'),
      email: Yup.string().email('Digite um email válido').required('O email é obrigatório'),
      password: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('A senha é obrigatória'),
      // passwordConfirm não é enviado para o backend, apenas validado no frontend
    });

    // 2. Validar os dados da requisição
    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, email, password } = request.body;

    // 3. Verificar se o email já existe
    const userExists = await User.findOne({
      where: { email },
    });

    if (userExists) {
      return response.status(409).json({ error: 'Email já cadastrado.' }); // 409 Conflict
    }

    // 4. Criar o usuário (o hook beforeSave no modelo User cuidará do hashing da senha)
    const user = await User.create({
      name,
      email,
      password, // O campo virtual 'password' será usado pelo hook beforeSave
      admin: false, // Default para novos usuários
    });

    // 5. Retornar os dados do usuário (excluindo password_hash)
    const { id, admin } = user;
    return response.status(201).json({
      id,
      name,
      email,
      admin,
    });
  }

  // Você pode ter outros métodos aqui, como update, index, delete, etc.
  // async update(request, response) { ... }
  // async index(request, response) { ... }
}

export default new UserController();

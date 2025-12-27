// src/app/controllers/UserController.js
// Remova a importação de 'v4' da biblioteca 'uuid', pois não será mais usada para IDs.
// import { v4 } from 'uuid'; // <-- REMOVA ESTA LINHA

import * as Yup from 'yup';
import User from '../models/User.js';

class UserController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });
    try {
      schema.validateSync(request.body, { abortEarly: false });
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

    // CRUCIAL: NÃO inclua 'id' aqui. Deixe o banco de dados gerá-lo automaticamente.
    const user = await User.create({
      name,
      email,
      password, // O hook 'beforeSave' do modelo cuidará do hash
      admin,
    });

    // Retorne os dados do usuário, incluindo o ID gerado pelo banco de dados
    return response.status(201).json({ id: user.id, name, email, admin });
  }

  // ... (outros métodos como update, index)
}

export default new UserController();

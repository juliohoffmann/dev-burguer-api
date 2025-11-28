// biome-ignore assist/source/organizeImports: imports are manually organized
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { userCreateSchema, userUpdateSchema } from '../schemas/UserSchema.js';

class UserController {
  async store(request, response) {
    try {
      const { name, email, password, admin } = request.body;
      await userCreateSchema.validate({ name, email, password, admin });

      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return response.status(400).json({ 
          message: 'Este e-mail já está cadastrado!' 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        id: v4(),
        name,
        email,
        password_hash: hashedPassword,
        admin: admin || false,
      });

      return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      });
    } catch (error) {
      return response.status(400).json({ 
        message: error.message 
      });
    }
  }

  async index(request, response) {
    try {
      const users = await User.findAll();
      return response.json(users);
    } catch (error) {
      return response.status(400).json({ 
        message: error.message 
      });
    }
  }

  async show(request, response) {
    try {
      const { id } = request.params;
      const user = await User.findByPk(id);

      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      return response.json(user);
    } catch (error) {
      return response.status(400).json({ 
        message: error.message 
      });
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;
      const { name, email, admin } = request.body;
      await userUpdateSchema.validate({ name, email, admin });

      const user = await User.findByPk(id);

      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      await user.update({ name, email, admin });
      return response.json(user);
    } catch (error) {
      return response.status(400).json({ 
        message: error.message 
      });
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;
      const user = await User.findByPk(id);

      if (!user) {
        return response.status(404).json({ error: 'User not found' });
      }

      await user.destroy();
      return response.status(204).send();
    } catch (error) {
      return response.status(400).json({ 
        message: error.message 
      });
    }
  }
}

export default new UserController();

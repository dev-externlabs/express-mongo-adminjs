import { z } from 'zod';
import { password, objectId } from './custom.validation.js';

const createUser = z.object({
  body: z.object({
    email: z.string().email(),
    password,
    name: z.string(),
    role: z.enum(['user', 'admin']),
  }),
});

const getUsers = z.object({
  query: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z.number().int().optional(),
    page: z.number().int().optional(),
  }),
});

const getUser = z.object({
  params: z.object({
    userId: objectId,
  }),
});

const updateUser = z.object({
  params: z.object({
    userId: objectId,
  }),
  body: z
    .object({
      email: z.string().email().optional(),
      password,
      name: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be updated',
    }),
});

const deleteUser = z.object({
  params: z.object({
    userId: objectId,
  }),
});

const userValidation = {
  createUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
};

export default userValidation;

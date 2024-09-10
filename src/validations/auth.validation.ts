import { z } from 'zod';
import {password} from "@/validations/custom.validation"

const register = z.object({
  body: z.object({
    email: z.string().email().min(1,{ message: 'Email is required' }),
    password,
    name: z.string().min(1, { message: 'Name is required' }),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().min(1,{ message: 'Email is required' }),
    password: z.string().min(1,{ message: 'Password is required' }),
  }),
});

const logout = z.object({
  body: z.object({
    refreshToken: z.string().min(1,{ message: 'Refresh token is required' }),
  }),
});

const refreshTokens = z.object({
  body: z.object({
    refreshToken: z.string().min(1,{ message: 'Refresh token is required' }),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string().email().min(1,{ message: 'Email is required' }),
  }),
});

const resetPassword = z.object({
  query: z.object({
    token: z.string().min(1,{ message: 'Token is required' }),
  }),
  body: z.object({
    password,
  }),
});

const verifyEmail = z.object({
  query: z.object({
    token: z.string().min(1,{ message: 'Token is required' }),
  }),
});


const authValidation = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};

export default authValidation;

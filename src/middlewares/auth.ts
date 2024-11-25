import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { getRoleRights } from '../../config/roles';
import { IUser } from '@/interfaces';

const verifyCallback = (req: Request, resolve: (value?: unknown) => void, reject: (err: unknown) => void, requiredRights: string[]) => async (err: unknown, user: IUser, info: unknown) => {

  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = getRoleRights(user.role!);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights: string[]) => async (req:Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;

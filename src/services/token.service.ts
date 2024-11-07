import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import httpStatus from 'http-status';
import config from '#/config';
import userService from './user.service';
import { Token } from '@/models';
import ApiError from '@/utils/ApiError';
import { tokenTypes } from "#/tokens";
import { IHydratedUser  } from '@/interfaces';

/* *
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId: string, expires: Moment, type:string, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token: string, userId: string, expires:Moment, type:string, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

/* *
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token:string, type: string) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/* *
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (id: string) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/* *
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email:string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/* *
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: IHydratedUser) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

const tokenService =  {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};

export default tokenService;

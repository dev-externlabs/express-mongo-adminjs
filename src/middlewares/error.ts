import PrettyError from 'pretty-error';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config/config.js';
import logger from '../../config/logger.js';
import ApiError from '@/utils/ApiError';

const pe = new PrettyError();
pe.appendStyle({
   'pretty-error > header > title > kind': {
      display: 'none'
   },
   'pretty-error > header > colon': {
      display: 'none'
   },
   'pretty-error > header > message': {
      color: 'bright-white',
      background: 'red',
   },
   'pretty-error > trace > item': {
      marginLeft: 2,
      bullet: '"<grey>o</grey>"'
   },
   'pretty-error > trace > item > header > pointer > file': {
      color: 'bright-cyan'
   },
   'pretty-error > trace > item > header > pointer > colon': {
      color: 'cyan'
   },

   'pretty-error > trace > item > header > pointer > line': {
      color: 'bright-cyan'
   },

   'pretty-error > trace > item > header > what': {
      color: 'bright-white'
   },

   'pretty-error > trace > item > footer > addr': {
      display: 'none'
   }
});

const errorConverter = (err: Error, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const {message} = error;
    error = new ApiError(httpStatus.BAD_REQUEST, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    // ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(pe.render(err));
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };

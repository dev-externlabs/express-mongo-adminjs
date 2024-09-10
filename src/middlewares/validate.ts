import httpStatus from 'http-status';
import { Response, NextFunction, Request } from 'express';
import { ZodObject, ZodRawShape } from 'zod';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';

const validate = (schema:ZodObject<ZodRawShape>) => (rawReq: Request, res:Response, next:NextFunction) => {
  const validSchema = pick(schema.shape, ['params', 'query', 'body']);
  const req:{[key:string]:unknown} = {...rawReq}
  const object = pick(req, Object.keys(validSchema));
  const {data, error} = schema.safeParse(object)
  if (error) {
    const errorMessage = error.issues.map((issue) => `${issue.path} ${issue.message}`).join("; ")
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, data);
  return next();
};

export default validate;

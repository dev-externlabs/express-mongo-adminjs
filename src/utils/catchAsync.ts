import { NextFunction, Request, Response } from "express";

/* eslint-disable @typescript-eslint/no-explicit-any */
const catchAsync = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) =>{

    return  next(err)
  });
};

export default catchAsync

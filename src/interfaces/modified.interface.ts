import { Request } from "express";

export interface IExRequest extends Request {
    user: unknown;
}

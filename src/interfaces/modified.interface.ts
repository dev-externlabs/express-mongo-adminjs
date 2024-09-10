import { Request } from "express";
import { IUser } from "./models/user.interface";

export interface IExRequest extends Request {
    user: IUser;
}

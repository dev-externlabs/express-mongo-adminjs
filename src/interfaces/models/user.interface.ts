import { Model, HydratedDocument, Types } from 'mongoose';

export interface IUser{
    name?:string;
    email?:string;
    password?: string;
    role?: string;
    isEmailVerified?:boolean;
}
export interface IHydratedUser extends HydratedDocument<IUser> {}

export interface IUserMethods {
    isPasswordMatch(password: string) : Promise<boolean>
}

export interface IUserModel extends Model<IUser, unknown, IUserMethods> {
    isEmailTaken(email: string, excludeUserId?: Types.ObjectId): Promise<HydratedDocument<IUser, IUserMethods>>,
    paginate(filters:object, options: object): Promise<IUser>
}

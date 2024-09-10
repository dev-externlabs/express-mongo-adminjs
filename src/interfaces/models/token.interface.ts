import { Types,Model } from 'mongoose';

export interface IToken{
    token:string;
    user:Types.ObjectId;
    type: string;
    expires: Date;
    blacklisted:boolean;
}

export interface ITokenDocument {

}

export interface ITokenModel extends Model<IToken, unknown, ITokenDocument> {

}

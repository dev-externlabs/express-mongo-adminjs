/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from "mongoose";

const userDataById =(schema: Schema<any, any, any, any, any>) => {
    schema.statics.userData = async function name(id:string) {
        const data = await this.findById(id, {password:0, role:0, isEmailVerified:0,__v:0})
        return data
    }
}

export default userDataById

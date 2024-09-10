import {Schema, Types, model} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
// import toJSON from './plugins/toJSON.plugin.js';
import {paginate} from './plugins';
import { roles } from '#/roles';
import { IUser, IUserMethods, IUserModel } from '@/interfaces/models/user.interface';

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value:string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email:string,excludeUserId?:Types.ObjectId) {
  // const user = await this.findOne({ email });
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string) {
  const result = await bcrypt.compare(password, this.password!)
  return result
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password!, 8);
  }
  next();
});

const User = model<IUser, IUserModel>('User', userSchema);

export default User;

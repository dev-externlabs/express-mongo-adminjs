import {Schema, model, SchemaTypes} from 'mongoose';

import { tokenTypes } from '#/tokens';
import { IToken, ITokenDocument, ITokenModel } from '@/interfaces';
// import toJSON from './plugins/toJSON.plugin.js/index.js';

const tokenSchema = new Schema<IToken, ITokenModel, ITokenDocument>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to JSON
// tokenSchema.plugin(toJSON);

/* *
 * @typedef Token
 */
const Token = model<IToken, ITokenModel>('Token', tokenSchema);

export default Token;

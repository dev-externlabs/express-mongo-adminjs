import httpStatus from 'http-status';
import { Types } from 'mongoose';
import {User} from '@/models';
import ApiError from '@/utils/ApiError';
import { IUser } from '@/interfaces';


const createUser = async (userBody: IUser) => {
  if (await User.isEmailTaken(userBody.email!)) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }
  return User.create(userBody);
};

/* *
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter:object, options:object) => {
  const users = await User.paginate(filter, options);
  return users;
};

/* *
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id: Types.ObjectId) => {
  return User.findById(id);
};

/* *
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email: string)  =>
   {
  return User.findOne({ email });
};

/* *
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId: Types.ObjectId, updateBody: IUser) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/* *
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: Types.ObjectId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};

const userService = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

export default userService;

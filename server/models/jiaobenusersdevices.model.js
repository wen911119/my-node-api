import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const JiaoBenUsersDevicesSchema = new mongoose.Schema({
  openId: {
    type: String
  },
  deviceId: {
    type: String,
    required: true,
    match: [/^D[0-9]+/, '{PATH} ({VALUE}) 不是合法的设备编号。']
  },
  deviceType: {
    type: String
  },
  deviceModel: {
    type: String
  },
  devicePixels: {
    type: String
  },
  gameCode: {
    type: String,
    match: [/^G[0-9]+/, '{PATH} ({VALUE}) 不是合法的游戏编号。']    
  },
  distributorId: {
    type: String,
    match: [/^J[0-9]+/, '{PATH} ({VALUE}) 不是合法的脚本作者编号。']    
  },
  fkey: {
    type: String
  },
  lastLoginTime: {
    type: Date
  },
  lastLoginPosition: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
JiaoBenUsersDevicesSchema.method({
});

/**
 * Statics
 */
JiaoBenUsersDevicesSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', JiaoBenUsersDevicesSchema);

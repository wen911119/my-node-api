import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  // 用户openid
  openId: {
    type: String,
    required: true
  },
  // 用户点卡
  coins: {
    type: Number,
    default: 0
  },
  // 用户购买的应用
  apps: {
    type: Array,
    default: []
  },
  // 用户授权的设备 
  devices: {
    type: Array,
    default: []
  },
  // 用户上次登录时间
  lastLogin: {
    type: Date
  },
  // 用户创建时间
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
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {
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

  /**新增或者更新user */
  createOrUpdate(openid, appid, deviceid, developid) {
    return this.update({ openId: openid }, { $push: { devices: { deviceId: deviceid } } }, { upsert: true }).exec();
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
  },


};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);

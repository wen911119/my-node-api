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

  addApp(data, strategy){
    let self = this;
    return self.findOne({openId:data.openId}).exec().then(function(user){
      if(user){
        console.log(user, 888);
        // 用户存在
        // 还要判断应用存不存在
        if(user.apps && user.apps.some(item=>item.appId == data.appId)){
          // 应用已经存在了，只要更新下该应用的devicesNum
          return self.update({openId:data.openId,apps:{$elemMatch:{appId:data.appId}}},{$inc:{"apps.$.devicesNum":1}}).exec()

        }else{
          // 应用不存在
          return self.update({openId:data.openId},{$addToSet:{apps:{appId:data.appId,coins:strategy.giftCoins,devicesNum:1}}}).exec()
        }
      }else{
        // 用户不存在
        // 要创建一个用户
        // 但同时也给用户添加了一个app,这个app的总送点卡数需要先查出来
        return self.create({openId:data.openId, apps:[{appId:data.appId,coins:strategy.giftCoins,devicesNum:1}]})
      }
    });
  },

  checkCoin(openid, appid){
    this.find({openId:openid,apps:{$elemMatch:{appId:appid}}},{"apps.$":1}).exec().then(function(user){
      if(user){
        return user
      }
      const err = new APIError('没有找到对应用户', httpStatus.NOT_FOUND);
      Promise.reject(err);
    });
  }



};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);

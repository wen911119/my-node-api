"use strict"
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
  get({ openid }) {
    return this.findOne({ openId: openid }).exec();
  },

  checkout(openid) {
    return this.findOne({ openId: openid }).exec()
      .then(function (user) {
        if (user) {
          return user
        }
        return this.create({ openId: openid }).exec();
      })
      .catch(e => Promise.reject(e));
  },

  /**新增或者更新user */
  createOrUpdate(openid, appid, deviceid, developid) {
    return this.update({ openId: openid }, { $push: { devices: { deviceId: deviceid } } }, { upsert: true }).exec();
  },


  addApp(appid) {
    let self = this;
    return self.findOne({ openId: data.openId }).exec().then(function (user) {
      if (user) {
        // 用户存在
        // 还要判断应用存不存在
        if (user.apps && user.apps.some(item => item.appId == data.appId)) {
          // 应用已经存在了，只要更新下该应用的devicesNum
          return self.update({ openId: data.openId, apps: { $elemMatch: { appId: data.appId } } }, { $inc: { "apps.$.devicesNum": 1 } }).exec()

        } else {
          // 应用不存在
          return self.update({ openId: data.openId }, { $addToSet: { apps: { appId: data.appId, coins: appInfo.strategy.giftCoins, devicesNum: 1 } } }).exec()
        }
      } else {
        // 用户不存在
        // 要创建一个用户
        // 但同时也给用户添加了一个app,这个app的总送点卡数需要先查出来
        return self.create({ openId: data.openId, apps: [{ appId: data.appId, coins: appInfo.strategy.giftCoins, devicesNum: 1 }] })
      }
    });
  },

  // 给用户添加一个应用
  addApp(openid, appid, giftCoins) {
    return this.findOneAndUpdate({ openId: openid }, { $addToSet: { apps: { appId: appid, coins: giftCoins, devicesNum: 1 } } }, { new: true }).exec();
  },
  // 给用户一个已经存在的应用增加一个设备
  addDeviceToApp(opened, appid) {
    return this.findOneAndUpdate({ openId: openid, apps: { $elemMatch: { appId: appid } } }, { $inc: { "apps.$.devicesNum": 1 } }, { new: true }).exec();
  },

  checkCoin({ openId, fkey, appId }) {
    return this.findOne({ openId: openId, apps: { $elemMatch: { appId: appId } } }, { "apps.$": 1 }).exec()
      .then(function (user) {
        if (user) {
          if (user.apps[0].coins > 0) {
            return { status: 'ok', data: fkey, msg: '登录成功' }
          } else {
            return Promise.reject({ status: 'fail', data: fkey, msg: '余额不足，请充值！' })
          }
        } else {
          return Promise.reject({ status: 'fail', data: '', msg: '该微信用户未找到' });
        }
      })
      .catch(e => {
        console.log(e);
        return Promise.reject(e);
      });
  },

  addCoin({ openid, appid, coinNum }) {
    return this.update({ openId: openid, apps: { $elemMatch: { appId: appid } } }, { $inc: { "appa.$.coins": coinNum } }, { new: true }).exec();
  },
  /**
   * 根据appid和developerid查用户
   * @param {*} appid 
   */
  queryByAppIdAndDeveloperId(appid, developerid) {
    return this.find({ apps: { $elemMatch: { appId: appid, developerId: developerid } } }, { "apps.$": 1 }).exec();
  },

  queryByOpenIdAndAppId(openid, appid, developerid) {
    return this.find({ openId: openid, apps: { $elemMatch: { appId: appid } } }, { "apps.$": 1 }).exec();
  }



};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);

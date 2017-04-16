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
   * 检查用户是否存在，不存在则新建一个并返回
   * @param {*} openid 
   */
  async checkout(openid) {
    let user = await this.findOne({ openId: openid }).exec()
    if (user) {
      return user
    }
    return this.create({ openId: openid, apps:[] });
  },


  // 给用户添加一个应用
  addApp(openid, appid, giftCoins) {
    return this.findOneAndUpdate({ openId: openid }, { $addToSet: { apps: { appId: appid, coins: giftCoins, devicesNum: 1 } } }, { new: true }).exec();
  },
  // 给用户一个已经存在的应用增加一个设备
  addDeviceToApp(opened, appid) {
    return this.findOneAndUpdate({ openId: openid, apps: { $elemMatch: { appId: appid } } }, { $inc: { "apps.$.devicesNum": 1 } }, { new: true }).exec();
  },
  // 设备登录时对所属用户的检查
  async loginCheck(openId, fkey, appId) {
    let user = await this.findOne({ openId: openId, apps: { $elemMatch: { appId: appId } } }, { "apps.$": 1 }).exec()
    if (user) {
      if (user.apps[0].coins > 0) {
        return { status: 'ok', data: fkey, msg: '登录成功' }
      } else {
        return { status: 'fail', data: fkey, msg: '余额不足，请充值！' }
      }
    } else {
      return { status: 'fail', data: '', msg: '该微信用户未找到' }
    }
  },

  async addCoin({ openid, appid, coinNum, developerid }) {
    // 先判断这个用户是不是存在，以防用户先充值再绑定
    let user = await this.findOne({ openId: openid }).exec();
    if (user && user.apps.some(item => item.appId == appid)) {
      // 用户存在并且应用存在
      return this.findOneAndUpdate({ openId: openid, apps: { $elemMatch: { appId: appid } } }, { $inc: { "appa.$.coins": coinNum } }, { new: true }).exec();
    } else if (user) {
      // 用户存在但是应用不存在
      return this.findOneAndUpdate({ openId: openid }, { $addToSet: { apps: { appId: appid, coins: coinNum, devicesNum: 0, developerId: developerid } } }, { new: true }).exec();
    } else {
      // 用户不存在
      return this.create({ appId: appid, apps: [{ appId: appid, coins: coinNum, devicesNum: 0, developerId: developerid }] });
    }
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

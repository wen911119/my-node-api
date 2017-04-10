import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import { randomStr } from '../../utils.js';

/**
 * User Schema
 */
const DevicesSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    match: [/^D[0-9]+/, '{PATH} ({VALUE}) 不是合法的设备编号。']
  },
  openId: {
    type: String,
    default: ''
  },
  qrcodeUrl: {
    type: String,
    required: true
  },
  deviceInfo: {
    type: Object
  },
  appId: {
    type: String,
    match: [/^G[0-9]+/, '{PATH} ({VALUE}) 不是合法的游戏编号。']
  },
  developerId: {
    type: String,
    match: [/^J[0-9]+/, '{PATH} ({VALUE}) 不是合法的脚本作者编号。']
  },
  fkey: {
    type: String,
    required: true
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
DevicesSchema.method({
});

/**
 * Statics
 */
DevicesSchema.statics = {
  create() {
    return this.find()
  },
  bind({ openid, deviceid, appid, developerid }) {
    // this.save({deviceId:deviceid, openId:openid})
    return this.findOneAndUpdate({ deviceId: deviceid }, { openId: openid, appId: appid, developerId: developerid }).exec();
  },
  checkoutDevice({ deviceid, appid, developid, mid }) {
    let self = this;
    return this.findOne({ deviceId: deviceid, appId: appid, developId: developid }).exec()
      .then(function (device) {
        if (device && (device.fkey + device.deviceId == mid)) {
          //return self.update({ deviceId: deviceid }, { fkey: randomStr(10) }).exec();
          return self.findOneAndUpdate({ deviceId: deviceid }, { fkey: '123456' }, { returnNewDocument: true }).exec();
        } else {
          return Promise.reject({ status: 'fail', data: '', msg: '设备没有注册或者非法授权' });
        }
      })
      .catch(e => {
        console.log(e);
        return Promise.reject(e);
      });
  },
  /**
   * 添加一台“裸”设备（缺省openid）
   * @param {*} deviceid 
   * @param {*} developerid 
   * @param {*} appid 
   * @param {*} deviceinfo 
   * @param {*} qrcodeurl 
   */
  addBareDevice(deviceid, developerid, appid, deviceinfo, qrcodeurl) {
    return this.create({
      deviceId: deviceid,
      qrcodeUrl: qrcodeurl,
      deviceInfo: deviceinfo,
      appId: appid,
      developerId: developerid,
      fkey: randomStr(20)
    }).exec();
  },
  /**
   * 根据设备id查设备
   * @param {*} deviceid 
   */
  queryById(deviceid) {
    return this.findOne({ deviceId: deviceid }).exec();
  },
  /**
   * 检查设备，是不是存在，是不是已经绑定过
   * @param {*} deviceid 
   */
  checkout(deviceid) {
    return this.findOne({ deviceId: deviceid }).exec()
      .then(function (device) {
        if (device) {
          if (device.openId) {
            return Promise.reject({ status: 'fail', data: null, msg: '设备已经绑定过' })
          }
          return device
        } else {
          return Promise.reject({ status: 'fail', data: null, msg: '设备不存在' })
        }
      })
      .catch(e => Promise.reject(e));
  },
  /**
   * 关联用户和设备
   * @param {*} openid 
   * @param {*} deviceid 
   */
  link(openid, deviceid) {
    return this.findOneAndUpdate({ deviceId: deviceid }, { openId: openid }).exec();
  },
  /**
   * 检查设备的skey是不是正确
   * @param {*} deviceid 
   * @param {*} skey 
   */
  checkoutSkey(deviceid, skey) {
    return this.findOne({ deviceId: deviceid }).exec()
      .then(function (device) {
        if (device && device.openId) {
          if (device.fkey + device.deviceId == skey) {
            return self.findOneAndUpdate({ deviceId: deviceid }, { fkey: randomStr(20) }, { returnNewDocument: true }).exec();
          }
          return Promise.reject({ status: 'fail', data: null, msg: '非法登录' })
        }
        return Promise.reject({ status: 'fail', data: null, msg: '设备不存在或未绑定' })
      })
      .catch(e => Promise.reject(e));
  }
};

/**
 * @typedef Device
 */
export default mongoose.model('Device', DevicesSchema);

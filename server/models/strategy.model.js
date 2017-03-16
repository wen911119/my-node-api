import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const StrategySchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
    match: [/^D[0-9]+/, '{PATH} ({VALUE}) 不是合法的设备编号。']
  },
  developerId: {
    type: String,
    required: true,
    match: [/^D[0-9]+/, '{PATH} ({VALUE}) 不是合法的设备编号。']
  },
  qrcodeUrl:{
    type:String,
    required:true
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
  appId: {
    type: String,
    match: [/^G[0-9]+/, '{PATH} ({VALUE}) 不是合法的游戏编号。']
  },
  developerId: {
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
  create(){
    return this.find()
  },
  bind({openid, deviceid, appid, developerid}){
    // this.save({deviceId:deviceid, openId:openid})
    return this.findOneAndUpdate({deviceId:deviceid, openId:''},{openId:openid,appid:appId,developerId:developerid}).exec();
  },
};

/**
 * @typedef Device
 */
export default mongoose.model('Device', JiaoBenUsersDevicesSchema);

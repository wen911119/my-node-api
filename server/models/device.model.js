import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import {randomStr} from '../../utils.js';

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
    type: String
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
    type: String,
    required:true
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
  create(){
    return this.find()
  },
  bind({openid, deviceid, appid, developerid}){
    // this.save({deviceId:deviceid, openId:openid})
    return this.findOneAndUpdate({deviceId:deviceid},{openId:openid,appId:appid,developerId:developerid}).exec();
  },
  checkoutDevice({deviceid, appid, developid, mid}){
    // todo fkey没有更新
    return this.find({deviceId:deviceid}).exec().then(function(device){
      if(device && (device.fkey+device.deviceId == mid)){
        return this.update({deviceId:deviceid},{fkey:randomStr(10)}).exec();
      }else{
        return false
      }
    }).then(function(updated_device){
      return updated_device
    });
  }
};

/**
 * @typedef Device
 */
export default mongoose.model('Device', DevicesSchema);

import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const JiaoBenUsersDevicesSchema = new mongoose.Schema({
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
  checkoutDevice({deviceid, appid, developid, mid}){
    // todo fkey没有更新
    return this.find({devideId:deviceid}).exec().then(function(deveice){
      if(device && (device.fkey+device.deviceId == mid)){
        return device
      }
      const err = new APIError('没有授权！', httpStatus.NOT_FOUND);
      Promise.reject(err);
    });
  }
};

/**
 * @typedef Device
 */
export default mongoose.model('Device', JiaoBenUsersDevicesSchema);

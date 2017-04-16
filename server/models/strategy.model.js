"use strict"
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
  giftCoins:{
    type:Number,
    required:true
  },
  consumeType: {
    type: Number
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
StrategySchema.method({
});

/**
 * Statics
 */
StrategySchema.statics = {
  
  get({appid, developerid}){
    // this.save({deviceId:deviceid, openId:openid})
    return this.findOne({appId:appid, developerId:developerid}).exec();
  }
};

/**
 * @typedef Device
 */
export default mongoose.model('Strategy', StrategySchema);

"use strict"
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import { randomStr } from '../../utils.js';

/**
 * NormalRedeemCode Schema
 */
const NormalRedeemCodeSchema = new mongoose.Schema({
    // 兑换码的值
    value: {
        type: String,
        required: true
    },
    // 面额
    denomination: {
        type: Number
    },
    // 属于哪个应用，appid
    belongTo: {
        type: String
    },
    // 使用者的openid
    usedBy: {
        type: String,
        default: ''
    },
    // 创建者的开发者id
    createBy: {
        type: String
    },
    // 创建时间
    createdAt: {
        type: Date,
        default: Date.now
    },
    useAt: {
        type: Date
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
NormalRedeemCodeSchema.method({
});

/**
 * Statics
 */
NormalRedeemCodeSchema.statics = {
    // 创建一条普通兑换码
    generate(developerid, denomination, appid) {
        return this.create({ createBy: developerid, denomination: denomination, belongTo: appid, value: randomStr(20) });
    },
    // 使用一条兑换码
    consume({ openid, redeemcode }) {
        return this.findOneAndUpdate({ value: redeemcode }, { usedBy: openid, useAt: Date.now() }, { new: true }).exec()
    },
    // 检查一条兑换码是否有效，包括是否存在和是否使用过
    async check(redeemcode) {
        let code = await this.findOne({ value: redeemcode }).exec();
        if (code && !code.useAt) {
            return { status: 'ok', data: code, msg: '兑换码有效' }
        } else {
            return { status: 'fail', data: '', msg: '兑换码无效' }
        }
    },

    // 查询出某个开发者创建的，还没有使用过的兑换码
    getAllFreshRedeemCodeByAppIdAndDeveloperId(appid, developerid) {
        return this.find({ belongTo: appid, createBy: developerid, usedBy: '' }).exec();
    }
};



/**
 * @typedef NormalRedeemCode
 */
export default mongoose.model('NormalRedeemCode', NormalRedeemCodeSchema);

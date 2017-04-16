"use strict"
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * SuperRedeemCode Schema
 */
const SuperRedeemCodeSchema = new mongoose.Schema({
    // 兑换码的值
    value: {
        type: String,
        required: true
    },

    // 面额
    denomination: {
        type: Number,
        required: true
    },
    // 使用者的开发者id
    usedBy: {
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
SuperRedeemCodeSchema.method({
});

/**
 * Statics
 */
SuperRedeemCodeSchema.statics = {
    // 消费兑换码
    consume({ developerid, redeemcode }) {
        return this.findOneAndUpdate({ value: redeemcode }, { usedBy: developerid, useAt: Date.now() }, { new: true }).exec();
    },
    // 检查兑换码是否存在
    async check({ redeemcode }) {
        let data = await this.findOne({ value: redeemcode }).exec();
        if (data) {
            if (data.usedBy) {
                // 被用过了
                return { status: 'fail', data: null, msg: '兑换码已经被用过了' }
            } else {
                return { status: 'ok', data: data, msg: '兑换码合法' }
            }
        } else {
            return { status: 'fail', data: null, msg: '兑换码不存在' }
        }
    }
};

/**
 * @typedef SuperRedeemCode
 */
export default mongoose.model('SuperRedeemCode', SuperRedeemCodeSchema);

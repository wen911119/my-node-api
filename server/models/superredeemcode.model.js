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
        type: Number
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

    use({ developerid, redeemcode }) {
        // 先看下兑换码是不是存在并且没有用过
        let self = this;
        this.findOne({value:redeemcode})
            .exec()
            .then(function(data){
                if(data && !data.useAt){
                    return self.findOneAndUpdate({value:redeemcode},{usedBy:developerid, useAt:Date.now}, {returnNewDocument:true}).exec()
                }else{
                    return Promise.reject({ status: 'fail', data: '', msg: '兑换码无效' })                                                
                }
            })
            .catch(e=>Promise.reject(e));  
    }
};

/**
 * @typedef SuperRedeemCode
 */
export default mongoose.model('SuperRedeemCode', SuperRedeemCodeSchema);

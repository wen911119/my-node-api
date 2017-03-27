import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const ApplicationSchema = new mongoose.Schema({
    appId: {
        type: String,
        required: true,
        match: [/^A[0-9]+/, '{PATH} ({VALUE}) 不是合法的应用编号。']
    },
    developerId: {
        type: String,
        required: true,
        match: [/^J[0-9]+/, '{PATH} ({VALUE}) 不是合法的开发者编号。']
    },
    appName: {
        type: String,
        required: true
    },
    strategy:{
        type:Object,
        required: true
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
ApplicationSchema.method({
});

/**
 * Statics
 */
ApplicationSchema.statics = {
    get({deviceid, appid, developerid}){
        return this.findOne({appId:appid, developerId:developerid}).exec();
    }
};

/**
 * @typedef Device
 */
export default mongoose.model('Application', ApplicationSchema);

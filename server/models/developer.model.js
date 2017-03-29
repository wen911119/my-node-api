import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const DeveloperSchema = new mongoose.Schema({
    developerId: {
        type: String,
        required: true,
        match: [/^J[0-9]+/, '{PATH} ({VALUE}) 不是合法的开发者编号。']
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, '{PATH} ({VALUE}) 不是合法的邮箱。']
    },
    phone: {
        type: String,
        match: [/^1\d{10}/, '{PATH} ({VALUE}) 不是合法的手机号。']
    },
    coins: {
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
DeveloperSchema.method({
});

/**
 * Statics
 */
DeveloperSchema.statics = {
    register({ developerid, username, password, email, phone }) {
        return this.create({ developerId: developerid, userName: username, password: password, email: email, phone: phone }).exec();
    }
};

/**
 * @typedef Device
 */
export default mongoose.model('Application', DeveloperSchema);

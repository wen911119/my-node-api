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
        type: Number,
        default: 0
    },
    active:{
        type:Boolean,
        default: false
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
    createNewDeveloper({ developerid, password, email, phone }) {
        return this.create({ developerId: developerid, password: password, email: email, phone: phone }).exec();
    },
    queryByEmail({email}){
        return this.findOne({email: email}).exec();
    },
    checkDeveloper({email, password}){
        return this.findOne({email: email, password: password}).exec();        
    }
};

/**
 * @typedef Device
 */
export default mongoose.model('Developer', DeveloperSchema);

// import Promise from 'bluebird';
import mongoose from 'mongoose';
// import httpStatus from 'http-status';
// import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const commonIndexSchema = new mongoose.Schema({
  index: {
    type: Number
  },
  name: {
    type: String
  },
  lastUpdate: {
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
commonIndexSchema.method({
});

/**
 * Statics
 */
commonIndexSchema.statics = {
  getIndexAndRefresh:function(name){
    return this.findOneAndUpdate({name:name},{$inc:{index:1}}).exec();
  }
};

/**
 * @typedef Device
 */
export default mongoose.model('commonindex', commonIndexSchema);

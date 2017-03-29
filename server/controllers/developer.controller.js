import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';
import Device from '../models/device.model'




/**
 * 开发者注册
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function register(req, res, next) {
  if (req.body.username === user.username && req.body.password === user.password) {
    const token = jwt.sign({
      username: user.username
    }, config.jwtSecret);
    return res.json({
      token,
      username: user.username
    });
  }

  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
}



export default { register, getRandomNumber, deviceregisterWithoutOpenId };

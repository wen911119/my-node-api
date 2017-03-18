import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';
import Device from '../models/device.model'


// sample user, used for authentication
const user = {
  username: 'react',
  password: 'express'
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
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

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

function deviceloginWithoutOpenId(req, res, next) {
  const { deviceid, appid, developid, mid } = req.body;
  let _fkey = '';
  Device.checkoutDevice(req.body)
    .then(function (device) {
      _fkey = device.fkey;
      User.checkCoin(device.openId, device.appId);
    })
    .then(function(user){
      if(user.apps[0].coins>0){
        res.json({status:'ok',fkey:_fkey});
      }
      res.json({status:'fail',fkey:_fkey,msg:'余额不足，请充值！'});
    })
    .catch(e => next(e));

}

export default { login, getRandomNumber, deviceloginWithoutOpenId };

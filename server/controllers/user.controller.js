"use strict"
import User from '../models/user.model';
import NormalRedeemCode from '../models/normalredeemcode.model';


/**
 * Load user and append to req.
 */
// function load(req, res, next, id) {
//   User.get(id)
//     .then((user) => {
//       req.user = user; // eslint-disable-line no-param-reassign
//       return next();
//     })
//     .catch(e => next(e));
// }

/**
 * Get user
 * @returns {User}
 */
// function get(req, res) {
//   return res.json(req.user);
// }

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  User.createOrUpdate(req.body.openid, req.body.deviceid)
    .then(result => res.json(result))
    .catch(e => next(e));
}

function useNormalRedeemCode(req, res, next) {
  // 先要去检查充值码是否有效
  NormalRedeemCode.check(req.body.redeemcode)
    .then(function (validCode) {
      return User.addCoin({ openid: req.body.openid, appid: validCode.appId, coinNum: validCode.denomination })
    })
    .then(function (user) {
      res.json({
        status: 'ok',
        data: user,
        msg: '充值成功'
      });
    })
    .catch(e => res.json(e));
}

function getUserInfo(req, res, next) {
  User.get(req.body)
    .then(function(userInfo){
      if(userInfo){
        res.json({status:'ok', data:userInfo, msg:'查询成功'});
      }else{
        res.json({
          status:'fail',
          data:'',
          msg:'用户不存在'
        });
      }
    })
    .catch(e=>res.json(e));
}

export default { create, useNormalRedeemCode, getUserInfo };

import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';
import Developer from '../models/developer.model';
import CommonIndex from '../models/commonindex.model';
import SuperRedeemCode from '../models/superredeemcode.model';
import NormalRedeemCode from '../models/normalredeemcode.model';
import Application from '../models/application.model';





/**
 * 开发者注册
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function register(req, res, next) {
  Developer.queryByEmail(req.body)
    .then(function (data) {
      if (data) {
        return Promise.reject({ status: 'fail', data: null, msg: '该邮箱已经注册过' })
      } else {
        // todo 邮箱发送激活链接
        // 获取 developerid
        return CommonIndex.getNewIndex('developer')
      }
    })
    .then(function (data) {
      req.body.developerid = 'D' + data.index;
      return Developer.createNewDeveloper(req.body)
    })
    .then(function (newDeveloper) {
      if (newDeveloper) {
        res.json({ status: 'ok', data: newDeveloper, msg: '注册成功' });
      } else {
        return Promise.reject({ status: 'fail', data: null, msg: '注册失败' })
      }
    })
    .catch(e => res.json(e));
}
/**
 * 开发者登陆
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function login(req, res, next) {
  Developer.checkDeveloper(req.body)
    .then(function (developer) {
      if (data) {
        const token = jwt.sign({
          developerid: developer.developerid
        }, config.jwtSecret);
        res.json({
          status: 'ok',
          data: token,
          msg: '登录成功'
        });
      } else {
        res.json({
          status: 'fail',
          data: '',
          msg: '用户名或密码错误'
        });
      }
    })
}
/**
 * 开发者使用超级兑换码给自己充值
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function useSuperRedeemCode(req, res, next) {
  SuperRedeemCode.use({ developerid: req.user.developerid, redeemcode: req.body.redeemcode })
    .then(function (data) {
      return Developer.addCoin({ developerid: req.user.developerid, denomination: data.denomination });
    })
    .then(function (data) {
      res.json({ status: 'ok', data: data.coins, msg: '充值成功' });
    })
    .catch(e => res.json(e));
}
/**
 * 开发者生成普通兑换码
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function genNormalRedeemCode(req, res, next) {
  Developer.reduceCoin({ developerid: req.user.developerid, denomination: req.body.denomination })
    .then(function (data) {
      return NormalRedeemCode.create({ developerid: req.user.developerid, denomination: req.body.denomination })
    })
    .then(function (code) {
      res.json({
        status: 'ok',
        data: code,
        msg: '生成成功'

      });
    })
    .catch(e => res.json(e));
}
/**
 * 开发者查询自己创建出来的还没有被使用过的兑换码
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function getAllFreshRedeemCodeByAppId(req, res, next) {
  NormalRedeemCode.getAllFreshRedeemCodeByAppIdAndDeveloperId(req.body.appid, req.user.developerid)
    .then(function (redeemCodeList) {
      res.json({
        status: 'ok',
        data: redeemCodeList,
        msg: '查询成功'
      });
    })
    .catch(e => res.json(e));
}
/**
 * 开发者查询出自己名下的所有app
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function getAppList(req, res, next) {
  Application.getAppList(req.user.developerid)
    .then(function (appList) {
      res.json({
        status: 'ok',
        data: appList,
        msg: '查询成功'
      });
    })
    .catch(e => res.json(e));
}
/**
 * 开发者查询出自己某个应用下的所有用户
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function getUsersByAppId(req, res, next) {
  User.queryByAppId(req.body.appid)
    .then(function (usersList) {
      res.json({
        status:'ok',
        data:usersList,
        msg:'查询成功'
      });
    })
    .catch(e => res.json(e));
}
/**
 * 开发者根据用户编号查询某个具体用户
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function getUserByOpenIdAndAppId(req, res, next){
  User.queryByOpenIdAndAppId()
    .then(function(user){
      res.json({
        status:'ok',
        data:user,
        msg:'查询成功'
      });
    })
    .catch(e=>res.json(e));
}

export default { register, login, useSuperRedeemCode, genNormalRedeemCode, getAllFreshRedeemCodeByAppId };

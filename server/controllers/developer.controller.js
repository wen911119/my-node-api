import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';
import Developer from '../models/developer.model';
import CommonIndex from '../models/commonindex.model';
import SuperRedeemCode from '../models/superredeemcode.model';
import NormalRedeemCode from '../models/normalredeemcode.model';





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
    .then(function(data){
      req.body.developerid = 'D'+data.index;
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

function login(req, res, next) {
  Developer.checkDeveloper(req.body)
    .then(function (developer) {
      if (data) {
        const token = jwt.sign({
          developerid: developer.developerid
        }, config.jwtSecret);
        res.json({
          status:'ok',
          data:token,
          msg:'登录成功'
        });
      }else{
        res.json({
          status:'fail',
          data:'',
          msg:'用户名或密码错误'
        });
      }
    })
}

function useSuperRedeemCode(req, res, next){
  SuperRedeemCode.use({developerid:req.user.developerid, redeemcode:req.body.redeemcode})
    .then(function(data){
      return Developer.addCoin({developerid:req.user.developerid, denomination:data.denomination});
    })
    .then(function(data){
      res.json({status:'ok', data:data.coins, msg:'充值成功'});
    })
    .catch(e=>res.json(e));
}

function genNormalRedeemCode(req, res, next){
  Developer.reduceCoin({developerid:req.user.developerid, denomination:req.body.denomination})
           .then(function(data){
              return NormalRedeemCode.create({developerid:req.user.developerid, denomination:req.body.denomination})
           })
           .then(function(code){
            res.json({
              status:'ok',
              data:code,
              msg:'生成成功'

            });
           })
           .catch(e=>res.json(e));
}
export default { register, login };

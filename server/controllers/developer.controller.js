"use strict"
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
async function register(req, res, next) {
  try {
    // 先要去校验该邮箱是不是已经注册过
    let developer_res = await Developer.queryByEmail(req.body);
    if (developer_res) {
      // 邮箱已经注册过，直接返回
      res.json({ status: 'fail', data: null, msg: '该邮箱已经注册过' });
    } else {
      // 确实是新用户，为新用户分配id
      let index_res = await CommonIndex.getNewIndex('developer');
      // 拿到新用户的id，去创建新用户
      req.body.developerid = 'D' + index_res.index;
      let newDeveloper = await Developer.createNewDeveloper(req.body)
      res.json({ status: 'ok', data: newDeveloper, msg: '注册成功' });
    }
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}

/**
 * 开发者登陆
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function login(req, res, next) {
  try {
    let developer = await Developer.checkDeveloper(req.body);
    if (developer) {
      const token = jwt.sign({
        developerid: developer.developerId
      }, config.jwtSecret);
      res.json({ status: 'ok', data: token, msg: '登录成功' });
    } else {
      res.json({ status: 'fail', data: null, msg: '用户名或密码错误' });
    }
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}

/**
 * 获取开发者详细信息
 * 需要token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getDeveloperInfo(req, res, next) {
  try {
    let developer_info = await Developer.queryByDeveloperId(req.user.developerid);
    res.json({ status: 'ok', data: developer_info, msg: '获取成功' });
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}


/**
 * 开发者使用超级兑换码给自己充值
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function useSuperRedeemCode(req, res, next) {
  try {
    // 检查兑换码是不是存在，有没有被用过
    let check_res = await SuperRedeemCode.check(req.body)
    if (check_res.status == 'ok') {
      let [consume_res, addCoin_res] = await Promise.all([SuperRedeemCode.consume({ developerid: req.user.developerid, redeemcode: req.body.redeemcode }), Developer.addCoin({ developerid: req.user.developerid, denomination: check_res.data.denomination })]);
      if (consume_res && addCoin_res) {
        res.json({ status: 'ok', data: addCoin_res.coins, msg: '充值成功' })
      } else {
        res.json({ status: 'fail', data: null, msg: '充值失败:' + req.user.developerid });
      }
    } else {
      // 检查不通过
      res.json({ status: 'fail', data: null, msg: check_res.msg });
    }
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}

/**
 * 开发者生成普通兑换码
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function genNormalRedeemCode(req, res, next) {
  try {
    // 先要检查该开发者的账户余额够不够生成这种面额的序列号
    let developer_info = await Developer.queryByDeveloperId(req.user.developerid);
    if (developer_info.coins >= req.body.denomination) {
      // 同时 扣减开发者账户余额和生成序列号
      let [reduce_res, redeem_create_res] = await Promise.all([
        Developer.reduceCoin({ developerid: req.user.developerid, denomination: req.body.denomination }),
        NormalRedeemCode.generate(req.user.developerid, req.body.denomination, req.body.appid)
      ]);
      if (reduce_res && redeem_create_res) {
        res.json({ status: 'ok', data: { code: redeem_create_res, developerCoins: reduce_res.coins }, msg: '充值成功' })
      } else {
        res.json({ status: 'fail', data: null, msg: '生成失败' });
      }
    } else {
      res.json({ status: 'fail', data: null, msg: '账户余额不足' });
    }
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}



/**
 * 开发者查询自己创建出来的还没有被使用过的兑换码
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getAllFreshRedeemCodeByAppId(req, res, next) {
  try {
    let fresh_code_list = await NormalRedeemCode.getAllFreshRedeemCodeByAppIdAndDeveloperId(req.body.appid, req.user.developerid)
    res.json({ status: 'ok', data: fresh_code_list, msg: '查询成功' });
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}
/**
 * 开发者新建一个app
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function createNewApp(req, res, next) {
  try {
    // 要先拿到分配的appid
    let app_id = await CommonIndex.getNewIndex('application');
    req.body.developerid = req.user.developerid;
    req.body.appid = 'A' + app_id.index;
    let new_app_res = await Application.createNew(req.body);
    res.json({ status: 'ok', data: new_app_res, msg: '创建成功' });
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}


/**
 * 开发者查询出自己名下的所有app
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getAppList(req, res, next) {
  try {
    let app_list = await Application.queryByDeveloperId(req.user.developerid)
    res.json({ status: 'ok', data: app_list, msg: '查询成功' });
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}



/**
 * 开发者查询出自己某个应用下的所有用户
 * 需要token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getUsersByAppId(req, res, next) {
  try {
    let user_list = await User.queryByAppIdAndDeveloperId(req.body.appid, req.user.developerid);
    res.json({ status: 'ok', data: user_list, msg: '查询成功' });
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}


/**
 * 开发者查询自己某个应用下的某个用户
 * 需要token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getUserByAppIdAndUserId(req, res, next) {
  try {
    let user_list = await User.queryByOpenIdAndAppId(req.body.userid, req.body.appid, req.user.developerid);
    res.json({ status: 'ok', data: user_list, msg: '查询成功' });
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}

export default {
  register,
  login,
  useSuperRedeemCode,
  genNormalRedeemCode,
  getAllFreshRedeemCodeByAppId,
  getAppList,
  createNewApp,
  getDeveloperInfo,
  getUsersByAppId,
  getUserByAppIdAndUserId
};

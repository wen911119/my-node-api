"use strict"
import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import developerCtrl from '../controllers/developer.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap
/**
 * 开发者注册
 */
router.route('/register')
  .post(validate(paramValidation.developerRegister), developerCtrl.register);


/**
 * 开发者登录
 */
router.route('/login')
  .post(validate(paramValidation.developerLogin), developerCtrl.login);

/**
 * 开发者获取自己的详细信息
 * 需要token
 */
router.route('/getDeveloperInfo')
  .get(expressJwt({ secret: config.jwtSecret }), developerCtrl.getDeveloperInfo);


/**
 * 开发者使用超级兑换码
 * 需要token
 */
router.route('/useSuperRedeemCode')
  .post(validate(paramValidation.useSuperRedeemCode),expressJwt({ secret: config.jwtSecret }), developerCtrl.useSuperRedeemCode);

/**
 * 开发者生成普通兑换码
 * 需要token
 */
router.route('/genNormalRedeemCode')
  .post(validate(paramValidation.genNormalRedeemCode),expressJwt({ secret: config.jwtSecret }), developerCtrl.genNormalRedeemCode);

/**
 * 开发者获取所有自己生成的还没有被使用过的普通兑换码
 * 需要token
 */
router.route('/getAllFreshRedeemCodeByAppId')
  .post(validate(paramValidation.getAllFreshRedeemCodeByAppId),expressJwt({ secret: config.jwtSecret }), developerCtrl.getAllFreshRedeemCodeByAppId);

/**
 * 开发者创建新app
 * 需要token
 */
router.route('/createNewApp')
  .post(validate(paramValidation.createNewApp),expressJwt({ secret: config.jwtSecret }), developerCtrl.createNewApp);

/**
 * 开发者获取所有自己创建的app
 * 需要token
 */
router.route('/getAppList')
  .post(validate(paramValidation.getAppList),expressJwt({ secret: config.jwtSecret }), developerCtrl.getAppList);


/**
 * 开发者查询自己某个应用下的所有用户
 * 需要token
 */
router.route('/getUsersByAppId')
  .post(validate(paramValidation.getUsersByAppId),expressJwt({ secret: config.jwtSecret }), developerCtrl.getUsersByAppId);

/**
 * 开发者查询自己某个应用下的某个用户
 * 需要token
 */
router.route('/getUserByAppIdAndUserId')
  .post(validate(paramValidation.getUserByAppIdAndUserId),expressJwt({ secret: config.jwtSecret }), developerCtrl.getUserByAppIdAndUserId);



/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */


export default router;

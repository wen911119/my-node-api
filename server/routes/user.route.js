"use strict"
import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';

const router = express.Router(); // eslint-disable-line new-cap


router.route('/bind')
 
  .post(validate(paramValidation.bindDevice), userCtrl.bind);


router.route('/useNormalRedeemCode')
 
  .post(validate(paramValidation.useNormalRedeemCode), userCtrl.useNormalRedeemCode);


router.route('/getUserInfo')
 
  .post(validate(paramValidation.getUserInfo), userCtrl.getUserInfo);


router.route('/getDevicesListByAppIdAndUserId')
 
  .post(validate(paramValidation.getDevicesListByAppIdAndUserId), userCtrl.getDevicesListByAppIdAndUserId);

router.route('/unbundlingDevice')
 
  .post(validate(paramValidation.unbundlingDevice), userCtrl.unbundlingDevice);


export default router;

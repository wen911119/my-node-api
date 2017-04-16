"use strict"
import User from '../models/user.model';
import NormalRedeemCode from '../models/normalredeemcode.model';
import Device from '../models/device.model'



/**
 * 设备绑定
 * 微信扫码发起
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function bind(req, res, next) {
  try {
    const { openid, deviceid } = req.body;
    // 同时查用户信息和设备信息，都返回了再相机处理  
    let [checkout_device_res, checkout_user_res] = await Promise.all([Device.checkout(deviceid), User.checkout(openid)]);
    if (checkout_device_res.status == 'ok') {
      let user;
      if (checkout_user_res.apps.some(item => item.appId == checkout_device_res.data.appId)) {
        // 用户已经有这个应用，只需要增加下这个应用下的设备数目
        user = await User.addDeviceToApp(openid, checkout_device_res.data.appId)
      } else {
        // 用户第一次添加这个应用,还要去查这个应用的优惠政策
        const appinfo = await Application.queryByAppId(checkout_device_res.data.appId)
        user = await User.addApp(openid, checkout_device_res.appId, appinfo.strategy.giftCoins)
      }
      // 最后关联用户和设备
      const bind_result = await Device.link(openid, deviceid);
      res.json({ status: 'ok', data: bind_result, msg: '绑定成功' });
    } else {
      res.json(checkout_device_res);
    }
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
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
    .then(function (userInfo) {
      if (userInfo) {
        res.json({ status: 'ok', data: userInfo, msg: '查询成功' });
      } else {
        res.json({
          status: 'fail',
          data: '',
          msg: '用户不存在'
        });
      }
    })
    .catch(e => res.json(e));
}

export default { create, useNormalRedeemCode, getUserInfo };

"use strict"
import User from '../models/user.model';
import NormalRedeemCode from '../models/normalredeemcode.model';
import Device from '../models/device.model'
import Application from '../models/application.model';



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


/**
 * 用户微信端使用普通兑换码充值
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function useNormalRedeemCode(req, res, next) {
  try {
    // 先要去检查充值码是否有效
    let check_res = await NormalRedeemCode.check(req.body.redeemcode);
    if (check_res.status == 'ok') {
      // 兑换码有效，继续下一步
      let validCode = check_res.data;
      // 给用户充值并且把这条兑换码消费掉
      let [user_res, code_res] = await Promise.all([
        User.addCoin({ openid: req.body.openid, appid: validCode.appId, coinNum: validCode.denomination, developerid: validCode.developerId }),
        NormalRedeemCode.consume(req.body.openid, req.body.redeemcode)
      ]);
      if (user_res && code_res) {
        res.json({ status: 'ok', data: user, msg: '充值成功' });
      } else {
        res.json({ status: 'fail', data: user, msg: '充值失败' });
      }
    } else {
      // 兑换码无效
      res.json(check_res);
    }
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}


/**
 * 用户查询自己的账户信息
 * 有哪些应用和绑定设备数量
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getUserInfo(req, res, next) {
  try {
    let user = await User.checkout(req.body.openid)
    res.json({ status: 'ok', data: user, msg: '查询成功' });
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}

/**
 * 用户查询自己某个应用下绑定了哪些设备
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getDevicesListByAppIdAndUserId(req, res, next) {
  try {
    let user_devices_list = await Device.queryByAppIdAndOpenId(req.body.appid, req.body.userid);
    res.json({ status: 'ok', data: user_devices_list, msg: '查询成功' });
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}

/**
 * 用户解绑设备
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function unbundlingDevice(req, res, next) {
  try {
    let remove = await Device.unbundling(req.body);
    res.json({ status: 'ok', data: remove, msg: '解绑成功' });
  } catch (e) {
    console.log(e, "记录异常");
    res.json({ status: 'fail', data: null, msg: '服务端异常' });
  }
}

// to 解绑设备
export default { useNormalRedeemCode, getUserInfo, bind, getDevicesListByAppIdAndUserId, unbundlingDevice };

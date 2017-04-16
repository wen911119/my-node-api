"use strict";
import Device from '../models/device.model'
import CommonIndex from '../models/commonindex.model';
import User from '../models/user.model';
import Application from '../models/application.model';
import { randomStr } from '../../utils.js';

var fetch = require('node-fetch');
let device_index = 0;
/**新建一个设备记录 */
function register(req, res, next) {
    CommonIndex.getNewIndex('device')
        .then(function (data) {
            const { appid, developerid } = req.body;
            device_index = data.index;
            const qr_param = 'D' + data.index + 'a' + appid + 'a' + developerid;
            //去微信拿到临时代带参二维码 
            return fetch('http://127.0.0.1:8080/wxapi/getqrcode?code=' + qr_param)
        })
        .then(function (qrcode) {
            return qrcode.text()
        })
        .then(function (qrcode_url) {
            if (qrcode_url) {
                const new_device = new Device({
                    deviceId: 'D' + device_index,
                    qrcodeUrl: qrcode_url,
                    fkey: randomStr(10)
                });
                return new_device.save()
            }
            return Promise.reject({ status: 'fail', data: null, msg: '获取二维码失败' })
        })
        .then(saveDevice => res.json({ status: 'ok', data: saveDevice, msg: '设备注册成功' }))
        .catch(e => res.json(e));
};

function bind(req, res, next) {
    //const {openid, deviceid, appid, developerid} = req.body;
    let _device = null;
    Device.bind(req.body)
        .then(function (device) {
            if (device) {
                // 要去查游戏优惠策略和扣费方式
                _device = device;
                return Application.get(req.body);
            } else {
                return Promise.reject({ status: 'fail', data: null, msg: '设备不存在' })
            }
        })
        .then(function (appInfo) {
            // 更具策略给给用户添加应用
            if (appInfo) {
                return User.addApp(_device, appInfo);
            } else {
                return Promise.reject({ status: 'fail', data: null, msg: '没找到应用信息' });
            }
        })
        .then(function (user) {
            // todo给用户送的点卡要从所属开发者账号内扣除
            res.json({ status: 'ok', data: user, msg: '成功' })
        })
        .catch(e => res.json(e));
}

/**
 * 设备注册
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function register2(req, res, next) {
    let deviceId = '';
    CommonIndex.getNewIndex('device')
        .then(function (data) {
            deviceId = 'D' + data.index;
            //去微信拿到临时代带参二维码 
            return fetch('http://127.0.0.1:8080/wxapi/getqrcode?code=' + data.index)
        })
        .then(function (qrcode) {
            return qrcode.text()
        })
        .then(function (qrcode_url) {
            if (qrcode_url) {
                let deviceInfo = {};
                try {
                    deviceInfo = JSON.parse(req.body.deviceinfo);
                } catch (e) {
                    console.log(e);
                }
                return Device.addBareDevice(deviceId, req.body.developerid, req.body.appid, deviceInfo, qrcode_url)
            } else {
                return Promise.reject({ status: 'fail', data: null, msg: '获取二维码失败' })
            }
        })
        .then(bareDevice => res.json({ status: 'ok', data: bareDevice, msg: '设备注册成功' }))
        .catch(e => res.json(e));
};
/**
 * 设备绑定
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function bind2(req, res, next) {
    const { openid, deviceid } = req.body;
    // 同时查用户信息和设备信息，都返回了再相机处理  
    let [checkout_device_res, checkout_user_res] = await Promise.all([Device.checkout(deviceid), User.checkout(openid)]);
    let user;
    if (checkout_user_res.apps.some(item => item.appId == checkout_device_res.appId)) {
        // 用户已经有这个应用，只需要增加下这个应用下的设备数目
        user = await User.addDeviceToApp(openid, checkout_device_res.appId)
    } else {
        // 用户第一次添加这个应用,还要去查这个应用的优惠政策
        const appinfo = await Application.queryByAppId(checkout_device_res.appId)
        user = await User.addApp(openid, checkout_device_res.appId, appinfo.strategy.giftCoins)
    }
    // 最后关联用户和设备
    const bind_result = await Device.link(openid, deviceid);
    // 返回结果
    res.json({ status: 'ok', data: bind_result, msg: '绑定成功' });


    // Promise.all([Device.checkout(deviceid), User.checkout(openid)])
    //     .then(function (values) {
    //         let user;
    //         if (values[1].apps.some(item => item.appId == values[0].appId)) {
    //             // 用户已经有这个应用，只需要增加下这个应用下的设备数目
    //             user = await User.addDeviceToApp(openid, values[0].appId)
    //         } else {
    //             // 用户第一次添加这个应用,还要去查这个应用的优惠政策
    //             const appinfo = await Application.queryByAppId(values[0].appId)
    //             user = await User.addApp(openid, values[0].appId, appinfo.strategy.giftCoins)
    //         }
    //         // 最后关联用户和设备
    //         const bind_result = await Device.link(openid, deviceid);
    //         res.json({
    //             status: 'ok',
    //             data: bind_result,
    //             msg: '绑定成功'
    //         })
    //     })
    //     .catch(e => res.json(e));
}

async function login(req, res, next) {
    const { deviceid, skey } = req.body;
    try {
        // 先检查skey
        const deviceinfo = await Device.checkoutSkey(deviceid, skey)
        // 还要检查该设备所有人的账户是不是欠费
        const user = await User.queryByOpenIdAndAppId(deviceinfo.openId, deviceinfo.appId)
        if (user.apps[0].coins > 0) {
            res.json({
                status: 'ok',
                data: deviceinfo.fkey,
                msg: '登录成功'
            })
        } else {
            res.json({
                status: 'fail',
                data: deviceinfo.fkey,
                msg: '余额不足，请充值！'
            })
        }
    } catch (e) {
        res.json(e);
    }

}

export default { register, bind };

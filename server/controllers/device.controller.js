"use strict";
import Device from '../models/device.model'
import CommonIndex from '../models/commonindex.model';
import User from '../models/user.model';
import Application from '../models/application.model';
import { randomStr } from '../../utils.js';

var fetch = require('node-fetch');
let device_index = 0;
/**
 * 新建一个设备记录
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function register(req, res, next) {
    try {
        // 先去申请一个设备号
        let device_index = await CommonIndex.getNewIndex('device');
        let deviceid = 'E' + device_index.index;
        // 用这个设备号去换取微信临时带参二维码
        let weixin_qrcode = await fetch('http://127.0.0.1:8080/wxapi/gettempqrcode?code=' + device_index.index)
        let qrcode_url = await weixin_qrcode.text();
        if (qrcode_url) {
            let deviceinfo = {};
            try {
                deviceinfo = JSON.parse(req.body.deviceinfo);
            } catch (e) {
                console.log(e)
            }
            let new_device = await Device.addBareDevice(deviceid, req.body.developerid, req.body.appid, deviceinfo, qrcode_url)
            res.json({ status: 'ok', data: new_device, msg: '设备注册成功' });
        } else {
            // 没拿到二维码
            res.json({ status: 'fail', data: null, msg: '获取二维码失败' });
        }
    } catch (e) {
        console.log(e, "记录异常");
        res.json({ status: 'fail', data: null, msg: '服务端异常' });
    }
};


/**
 * 设备登录
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function login(req, res, next) {
    const { deviceid, skey } = req.body;
    try {
        // 先检查skey
        const deviceinfo = await Device.loginCheck(deviceid, skey)
        if (deviceinfo.status == 'ok') {
            // 设备检查通过
            // 还要检查该设备所有人的账户是不是欠费
            const user_check_res = await User.loginCheck(deviceinfo.data.openId, deviceinfo.data.fkey, deviceinfo.data.appId)
            res.json(user_check_res);
        } else {
            res.json(deviceinfo);
        }
    } catch (e) {
        console.log(e, "记录异常");
        res.json({ status: 'fail', data: null, msg: '服务端异常' });
    }
}

export default { register, login };

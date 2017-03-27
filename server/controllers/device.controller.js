import Device from '../models/device.model'
import CommonIndex from '../models/commonindex.model';
import User from '../models/user.model';
import Application from '../models/application.model';
import {randomStr} from '../../utils.js';

var fetch = require('node-fetch');
let device_index = 0;
/**新建一个设备记录 */
function register(req, res, next) {
    CommonIndex.getNewIndex('device')
        .then(function (data) {
            const { appid, developerid } = req.body;
            device_index = data.index;
            const qr_param = data.index + 'a' + appid + 'a' + developerid;
            //去微信拿到临时代带参二维码 
            console.log(qr_param);
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
            res.send('获取二维码失败');
        })
        .then(saveDevice => res.json(saveDevice))
        .catch(e => next(e));
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
                res.json({ status: 'fail', data: null, msg: '设备不存在' });
            }
        })
        .then(function (appInfo) {
            // 更具策略给给用户添加应用
            if (appInfo) {
                return User.addApp(_device, appInfo);
            } else {
                res.json({ status: 'fail', data: null, msg: '没找到应用信息' });
            }
        })
        .then(function (user) {
            res.json({ status: 'ok', data: user, msg: '成功' })
        })
        .catch(e => next(e));
}

export default { register, bind };

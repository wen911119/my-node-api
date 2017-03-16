import Device from '../models/device.model'
import CommonIndex from '../models/commonindex.model';
import User from '../models/user.model';
import Strategy from '../models/strategy.model';



/**新建一个设备记录 */
function register(req, res, next) {
    CommonIndex.getNewIndex({ name: 'device' }).then(function (data) {
        const {appid, developerid} = req.body;
        const qr_param = parseInt(data.index+'a'+appid+'a'+developerid, 16);
        //todo 去微信拿到临时代带参二维码 
        const qrcode_url = '从微信拿回的带参临时二维码'
        const new_device = new Device({
            deviceId: 'D' + data.index,
            qrcodeUrl:qrcode_url
        });
        //res.json({deviceId: 'D' + data.index, qrcodeUrl:''})
        new_device.save()
            .then(saveDevice => res.json(saveDevice))
            .catch(e => next(e));
    }).catch(e => next(e));
};

function bind(req, res, next){
    //const {openid, deviceid, appid, developerid} = req.body;
    Device.bind(req.body).then(function(device){
        if(device){
            // 要去查游戏优惠策略和扣费方式
            Strategy.get(device).then(function(strategy){
                User.addApp(device, strategy).then(function(user){
                    
                });
            });
            
        }else{
            res.send('设备不存在');
        }
    }).catch(e=>next(e));
}

export default { create, bind };
import Device from '../models/device.model'
import CommonIndex from '../models/commonindex.model';
import User from '../models/user.model';


/**新建一个设备记录 */
function create(req, res, next) {
    CommonIndex.getIndexAndRefresh({ name: 'device' }).then(function (data) {
        //todo 去微信拿到临时代带参二维码 
        
        const new_device = new Device({
            deviceId: 'D' + data.index,
            qrcodeUrl:'123.png'
        });
        //res.json({deviceId: 'D' + data.index, qrcodeUrl:''})
        new_device.save()
            .then(saveDevice => res.json(saveDevice))
            .catch(e => next(e));
    }).catch(e => next(e));
};

function bindingOpenId(req, res, next){
    Device.binding(req.body).then(function(data){
        console.log(data, 888);
        // const new_user = new User({
        //     openId:data.openId
        // });
        // new_user.
        res.json(data);
    }).catch(e=>next(e));
}

export default { create, bindingOpenId };
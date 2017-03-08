import Device from '../models/device.model'
import CommonIndex from '../models/commonindex.model';

/**新建一个设备记录 */
function create(req, res, next) {
    CommonIndex.getIndexAndRefresh({ name: 'device' }).then(function (data) {
        // const new_device = new Device({
        //     deviceId: 'D' + data.index
        // });
        res.json({deviceId: 'D' + data.index, qrcodeUrl:''})
        // new_device.save()
        //     .then(saveDevice => res.json(saveDevice))
        //     .catch(e => next(e));
    }).catch(e => next(e));
};

export default { create };
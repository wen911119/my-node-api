import Device from '../models/jiaobenusersdevices.model'
import CommonIndex from '../models/commonindex.model'

/**新建一个设备记录 */
function create(req, res, next) {
    CommonIndex.findOneAndUpdate({name:'device'},{index:1}).then(function(data){
        
        res.json(data);
    }).catch(e=>next(e));
    // const new_device = new Device({
    //     deviceId: 'D103'
    // });
    // new_device.save()
    //     .then(saveDevice => res.json(saveDevice))
    //     .catch(e => next(e));
}

export default { create };
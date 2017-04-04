import Application from '../models/application.model'
import CommonIndex from '../models/commonindex.model';
import Strategy from '../models/strategy.model';

var fetch = require('node-fetch');
let application_index = 0;
/**新建一个设备记录 */
function add(req, res, next) {
    CommonIndex.getNewIndex('application')
        .then(function (data) {
            let {appname,  strategy} = req.body;

            strategy = JSON.parse(strategy);
            application_index = data.index;
            let new_app = new Application({
                appId:'A'+application_index,
                developerId:req.user.developerid,
                appName:appname,
                strategy:strategy
            });
            return new_app.save();
        })
        .then(function (save_res) {
            if(save_res){
                res.json({
                    status:'ok',
                    data:save_res,
                    msg:'创建成功'
                });
            }else{
                res.json({
                    status:'fail',
                    data:{},
                    msg:'创建失败'
                });
            }
        })
        .catch(e => next(e));
};



export default { add };

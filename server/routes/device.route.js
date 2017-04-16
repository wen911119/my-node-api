"use strict"
import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import deviceCtrl from '../controllers/device.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/register')
    
    .post(validate(paramValidation.deviceRegister), deviceCtrl.register);

router.route('/bind')
    .post(validate(paramValidation.deviceBind), deviceCtrl.bind);

// router.route('/:userId')
//   /** GET /api/users/:userId - Get user */
//   .get(userCtrl.get)

//   /** PUT /api/users/:userId - Update user */
//   .put(validate(paramValidation.updateUser), userCtrl.update)

//   /** DELETE /api/users/:userId - Delete user */
//   .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
//router.param('userId', userCtrl.load);

export default router;

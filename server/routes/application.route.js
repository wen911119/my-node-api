import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import applicationCtrl from '../controllers/application.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/add')
  .post(expressJwt({ secret: config.jwtSecret }), validate(paramValidation.application_add), applicationCtrl.add);



export default router;

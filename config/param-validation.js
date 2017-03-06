import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      openid: Joi.string().required(),
      deviceid: Joi.string().regex(/^D[0-9]+/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string().required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{10}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};

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
  },

  deviceloginWithoutOpenId:{
    body:{
      deviceid:Joi.string().regex(/^D[0-9]+$/).required(),
      appid:Joi.string().regex(/^G[0-9]+$/).required(),
      developerid:Joi.string().hex().required()
    }
  },

  deviceloginWithOpenId:{
    body:{
      deviceid:Joi.string().regex(/^D[0-9]+$/).required(),
      appid:Joi.string().regex(/^G[0-9]+$/).required(),
      developerid:Joi.string().hex().required()
    },
    params: {
      openid:Joi.string().hex().required()
    }
  },

  bindDevice:{
    body:{
      deviceid:Joi.string().required(),
      openid:Joi.string().required(),
      appid:Joi.string().required(),
      developerid:Joi.string().required()
    }
  },
  // 注册一台新设备
  registerDevice:{
    body:{
      appid:Joi.string().hex().required(),
      developerid:Joi.string().hex().required()
    }
  }
};

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

  deviceloginWithoutOpenId: {
    body: {
      deviceid: Joi.string().regex(/^D[0-9]+$/).required(),
      appid: Joi.string().regex(/^A[0-9]+$/).required(),
      developerid: Joi.string().required()
    }
  },

  deviceloginWithOpenId: {
    body: {
      deviceid: Joi.string().regex(/^D[0-9]+$/).required(),
      appid: Joi.string().regex(/^G[0-9]+$/).required(),
      developerid: Joi.string().hex().required()
    },
    params: {
      openid: Joi.string().hex().required()
    }
  },

  bindDevice: {
    body: {
      deviceid: Joi.string().required(),
      openid: Joi.string().required(),
      appid: Joi.string().required(),
      developerid: Joi.string().required()
    }
  },
  // 注册一台新设备
  registerDevice: {
    body: {
      appid: Joi.string().required(),
      developerid: Joi.string().required()
    }
  },
  // 创建新应用
  application_add: {
    body: {
      appname: Joi.string().required(),
      strategy: Joi.string().required()
    }
  },

  //开发者注册
  developerRegister: {
    body: {
      password: Joi.string().required(),
      email: Joi.string().regex(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).required(),
      phone: Joi.string().regex(/^1\d{10}/).required()
    }
  },
  test: {
    query: {
      test: Joi.string().required()
    }
  },
  useSuperRedeemCode:{
    body: {
      redeemCode: Joi.string().required()
    }
  },
  genNormalRedeemCode:{
    body: {
      denomination: Joi.number().required()
    }
  },
  useNormalRedeemCode:{
    body: {
      openid: Joi.string().required(),
      redeemcode:Joi.string().required()
    }
  },
  getUserInfo:{
    body: {
      openid: Joi.string().required()
    }
  },

  getAllFreshRedeemCodeByAppId:{
    body: {
      appid:Joi.string().required()
    }
  }
};

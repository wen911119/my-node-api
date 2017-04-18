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

  bindDevice:{
    body:{
      openid:Joi.string().required(),
      deviceid:Joi.string().required()
    }
  },
  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  deviceLogin: {
    body: {
      deviceid: Joi.string().regex(/^E[0-9]+$/).required(),
      //appid: Joi.string().regex(/^A[0-9]+$/).required(),
      //developerid: Joi.string().required(),
      skey:Joi.string().required()
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
  // 用户扫二维码绑定设备
  deviceBind: {
    body: {
      deviceid: Joi.string().required(),
      openid: Joi.string().required()
    }
  },
  // 注册一台新设备
  deviceRegister: {
    body: {
      appid: Joi.string().required(),
      developerid: Joi.string().required(),
      deviceinfo:Joi.string().required()
    }
  },
  // 创建新应用
  application_add: {
    body: {
      appname: Joi.string().required(),
      strategy: Joi.string().required()
    }
  },
  //=======================================开发者相关=====================//
  //开发者注册
  developerRegister: {
    body: {
      password: Joi.string().required(),
      email: Joi.string().regex(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).required(),
      phone: Joi.string().regex(/^1\d{10}/).required()
    }
  },
  // 开发者登录
  developerLogin: {
    body: {
      password: Joi.string().required(),
      email: Joi.string().regex(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).required()
    }
  },
  // 开发者使用超级兑换码,需要token
  useSuperRedeemCode: {
    body: {
      redeemcode: Joi.string().required()
    }
  },
  genNormalRedeemCode: {
    body: {
      denomination: Joi.number().required(),
      appid: Joi.string().required()
    }
  },
  useNormalRedeemCode: {
    body: {
      openid: Joi.string().required(),
      redeemcode: Joi.string().required()
    }
  },
  getUserInfo: {
    body: {
      openid: Joi.string().required()
    }
  },
  getDevicesListByAppIdAndUserId:{
    body:{
      appid:Joi.string().required(),
      userid: Joi.string().required()
    }
  },
  unbundlingDevice:{
    body:{
      deviceid:Joi.string().required(),
      openid:Joi.string().required(),
      appid:Joi.string().required()
    }
  },
  getAllFreshRedeemCodeByAppId: {
    body: {
      appid: Joi.string().required()
    }
  },
  createNewApp: {
    body: {
      appname: Joi.string().required(),
      giftcoins: Joi.number().required(),
      consumetype: Joi.number().required()
    }
  },
  getAppList: {
    body: {
      appid: Joi.string().required()
    }
  },
  getUsersByAppId: {
    body: {
      appid: Joi.string().required()
    }
  },
  getUserByAppIdAndUserId: {
    body: {
      appid: Joi.string().required(),
      userid: Joi.string().required()
    }
  },
  test: {
    body: {}
  }
};

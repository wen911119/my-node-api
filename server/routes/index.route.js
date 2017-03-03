import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import deviceRoutes from './device.route';


const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// 挂载 device相关路由 到／device下
router.use('/device', deviceRoutes);

export default router;

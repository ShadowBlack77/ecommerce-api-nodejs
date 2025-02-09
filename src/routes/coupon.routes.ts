import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const couponRouter = Router();

const couponController: CouponController = new CouponController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

couponRouter.get('/', authMiddleware.protectedRoute, couponController.getCoupon.bind(couponController));
couponRouter.post('/validate', authMiddleware.protectedRoute, couponController.validateCoupon.bind(couponController));

export default couponRouter;
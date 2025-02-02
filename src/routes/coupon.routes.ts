import express from 'express';
import { CouponController } from '../controllers/coupon.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

const couponController: CouponController = new CouponController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

router.get('/', authMiddleware.protectedRoute, couponController.getCoupon.bind(couponController));
router.post('/validate', authMiddleware.protectedRoute, couponController.validateCoupon.bind(couponController));

export default router;
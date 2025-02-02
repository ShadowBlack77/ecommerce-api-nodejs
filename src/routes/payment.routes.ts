import express from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

const paymentController: PaymentController = new PaymentController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

router.post('/create-checkout-session', authMiddleware.protectedRoute, paymentController.createCheckoutSession.bind(paymentController));
router.post('/checkout-success', authMiddleware.protectedRoute, paymentController.checkoutSuccess.bind(paymentController));

export default router;
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const paymentRouter = Router();

const paymentController: PaymentController = new PaymentController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

paymentRouter.post('/create-checkout-session', authMiddleware.protectedRoute, paymentController.createCheckoutSession.bind(paymentController));
paymentRouter.post('/checkout-success', authMiddleware.protectedRoute, paymentController.checkoutSuccess.bind(paymentController));

export default paymentRouter;
import express from 'express';
import { CartController } from '../controllers/cart.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

const cartController: CartController = new CartController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

router.get('/', authMiddleware.protectedRoute, cartController.getCartProducts.bind(cartController));
router.post('/', authMiddleware.protectedRoute, cartController.addToCart.bind(cartController));
router.delete('/', authMiddleware.protectedRoute, cartController.removeAllFromCart.bind(cartController));
router.put('/:id', authMiddleware.protectedRoute, cartController.updateQuantity.bind(cartController));

export default router;
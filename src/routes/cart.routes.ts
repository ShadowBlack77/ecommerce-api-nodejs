import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const cartRouter = Router();

const cartController: CartController = new CartController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

cartRouter.get('/', authMiddleware.protectedRoute, cartController.getCartProducts.bind(cartController));
cartRouter.post('/', authMiddleware.protectedRoute, cartController.addToCart.bind(cartController));
cartRouter.delete('/', authMiddleware.protectedRoute, cartController.removeAllFromCart.bind(cartController));
cartRouter.put('/:id', authMiddleware.protectedRoute, cartController.updateQuantity.bind(cartController));

export default cartRouter;
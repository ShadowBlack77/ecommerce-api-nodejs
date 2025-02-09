import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const productRouter = Router();

const productController: ProductController = new ProductController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

productRouter.get('/', authMiddleware.protectedRoute, authMiddleware.adminRoute, productController.getAllProducts.bind(productController));
productRouter.get('/featured', productController.getFeaturedProducts.bind(productController));
productRouter.get('/category/:category', productController.getProductsByCategory.bind(productController));
productRouter.get('/recommendations', productController.getRcommendedProducts.bind(productController));
productRouter.post('/', authMiddleware.protectedRoute, authMiddleware.adminRoute, productController.createProduct.bind(productController));
productRouter.patch('/:id', authMiddleware.protectedRoute, authMiddleware.adminRoute, productController.toggleFeaturedProduct.bind(productController));
productRouter.delete('/:id', authMiddleware.protectedRoute, authMiddleware.adminRoute, productController.deleteProduct.bind(productController));

export default productRouter;
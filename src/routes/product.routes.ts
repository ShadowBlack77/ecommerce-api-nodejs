import express from 'express';
import { ProductController } from '../controllers/product.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

const productController: ProductController = new ProductController();
const authMiddleware: AuthMiddleware = new AuthMiddleware();

router.get('/', authMiddleware.protectedRoute, authMiddleware.adminRoute, productController.getAllProducts.bind(productController));
router.get('/featured', productController.getFeaturedProducts.bind(productController));
router.get('/category/:category', productController.getProductsByCategory.bind(productController));
router.get('/recommendations', productController.getRcommendedProducts.bind(productController));
router.post('/', authMiddleware.protectedRoute, authMiddleware.adminRoute, productController.createProduct.bind(productController));
router.patch('/:id', authMiddleware.protectedRoute, authMiddleware.adminRoute, productController.toggleFeaturedProduct.bind(productController));
router.delete('/:id', authMiddleware.protectedRoute, authMiddleware.adminRoute, productController.deleteProduct.bind(productController));

export default router;
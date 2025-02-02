import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import couponRoutes from './routes/coupon.routes';
import paymentRoutes from './routes/payment.routes';

import { connectDB } from './lib/db.lib';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/coupon', couponRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server work on http://localhost:${PORT}`);
  connectDB();
});
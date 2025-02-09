import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors';

import productRouter from './routes/product.routes';
import authRouter from './routes/auth.routes';
import cartRouter from './routes/cart.routes';
import couponRouter from './routes/coupon.routes';
import paymentRouter from './routes/payment.routes';

import { connectDB } from './lib/db.lib';
import redisClient from './lib/redis.lib';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  
  if (req.headers['api-key'] && req.headers['api-key'] === process.env.API_KEY) {
    return next();
  }

  return res.status(401).json({ content: 'Access Denied' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/coupons', couponRouter);
app.use('/api/v1/payments', paymentRouter);

app.listen(PORT, async () => {
  console.log(`Server work on http://localhost:${PORT}`);
  connectDB();
  redisClient.connect();
});
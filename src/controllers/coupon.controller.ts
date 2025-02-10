import { Request, Response } from 'express';
import Coupon from "../models/coupon.model";

export class CouponController {

  public async getCoupon(req: Request | any, res: Response): Promise<any> {
    try {
      const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });

      res.status(200).json(coupon || null);
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async validateCoupon(req: Request | any, res: Response): Promise<any> {
    try {
      const { code } = req.body;
      const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

      if (!coupon) {
        return res.status(404).json({ content: "Coupon not found" });
      }

      if (coupon.expirationDate < new Date()) {
        coupon.isActive = false;
        await coupon.save();
        return res.status(404).json({ content: "Coupon expired" });
      }

      res.status(200).json({
        content: "Coupon is valid",
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
      });
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }
}
import { Request, Response } from 'express';
import Product from "../models/product.model";

export class CartController {

  public async getCartProducts(req: Request | any, res: Response): Promise<any> {
    try {
      const products = await Product.find({ _id: { $in: req.user.cartItems } });

      const cartItems = products.map((product) => {
        const item = req.user.cartItems.find((cartItem: any) => cartItem.id === product.id);
        
        return {
          ...product.toJSON(),
          quantity: item.quantity
        };
      });

      res.status(200).json(cartItems);
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async addToCart(req: Request | any, res: Response): Promise<any> {
    try {
      const { productId } = req.body;
      const user = req.user;

      const existingItem = user.cartItems.find((item: any) => item.id === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.cartItems.push(productId);
      }

      await user.save();

      res.status(200).json(user.cartItems);
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async removeAllFromCart(req: Request | any, res: Response): Promise<any> {
    try {
      const { productId } = req.body;
      const user = req.user;

      if (!productId) {
        user.cartItems = [];
      } else {
        user.cartItems = user.cartItems.filter((item: any) => item.id !== productId);
      }

      await user.save();

      res.status(200).json(user.cartItems);
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async updateQuantity(req: Request | any, res: Response): Promise<any> {
    try {
      const { id: productId } = req.params;
      const { quantity } = req.body;
      const user = req.user;
      const existingItem = user.cartItems.find((item: any) => item.id === productId);

      
		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item: any) => item.id !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ content: "Product not found" });
		}
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }
}
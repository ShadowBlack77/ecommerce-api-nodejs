import { Request, Response } from 'express';
import Product from '../models/product.model';

export class ProductController {

  public async getAllProducts(req: Request, res: Response): Promise<any> {
    try {
      const products = await Product.find({});

      return res.status(200).json({ products })
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async getFeaturedProducts(req: Request, res: Response): Promise<any> {

  }

  public async createProduct(req: Request, res: Response): Promise<any> {

  }

  public async deleteProduct(req: Request, res: Response): Promise<any> {

  }

  public async getRcommendedProducts(req: Request, res: Response): Promise<any> {

  } 

  public async getProductsByCategory(req: Request, res: Response): Promise<any> {

  }

  public async toggleFeaturedProduct(req: Request, res: Response): Promise<any> {

  }

  private async updateFeaturedProductsCache(): Promise<any> {

  }
}
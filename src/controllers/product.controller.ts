import { Request, Response } from 'express';
import Product from '../models/product.model';
import cloudinary from "../lib/cloudinary.lib";

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
    try {
      // let featuredProducts = await redis.get("featured_products");
      // if (featuredProducts) {
      //   return res.json(JSON.parse(featuredProducts));
      // }
  
      // featuredProducts = await Product.find({ isFeatured: true }).lean();
  
      // if (!featuredProducts) {
      //   return res.status(404).json({ message: "No featured products found" });
      // }
  
      // // store in redis for future quick access
  
      // await redis.set("featured_products", JSON.stringify(featuredProducts));
  
      // res.json(featuredProducts);
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async createProduct(req: Request, res: Response): Promise<any> {
    try {
      const { name, description, price, image, category } = req.body;
  
      let cloudinaryResponse = null;
  
      if (image) {
        cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
      }
  
      const product = await Product.create({
        name,
        description,
        price,
        image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
        category,
      });
  
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async deleteProduct(req: Request, res: Response): Promise<any> {
    try {
      const product: any = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ content: "Product not found" });
      }
  
      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log("deleted image from cloduinary");
        } catch (error) {
          console.log("error deleting image from cloduinary", error);
        }
      }
  
      await Product.findByIdAndDelete(req.params.id);
  
      res.json({ content: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async getRcommendedProducts(req: Request, res: Response): Promise<any> {
    try {
      const products = await Product.aggregate([
        {
          $sample: { size: 4 },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1,
            price: 1,
          },
        },
      ]);
  
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  } 

  public async getProductsByCategory(req: Request, res: Response): Promise<any> {
    try {
      const { category } = req.params;
      const products = await Product.find({ category });

      res.status(200).json({ products });
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async toggleFeaturedProduct(req: Request, res: Response): Promise<any> {
    try {
      const product: any = await Product.findById(req.params.id);
      if (product) {
        product.isFeatured = !product.isFeatured;
        const updatedProduct = await product.save();
        await this.updateFeaturedProductsCache();
        res.json(updatedProduct);
      } else {
        res.status(404).json({ content: "Product not found" });
      }
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  private async updateFeaturedProductsCache(): Promise<any> {
    try {
      const featuredProducts = await Product.find({ isFeatured: true }).lean();
      // await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error: any) {
      console.log("error in update cache function");
    }
  }
}
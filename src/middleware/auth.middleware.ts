import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { Request, Response, NextFunction } from 'express';


export class AuthMiddleware {

  public async protectedRoute(req: Request | any, res: Response, next: NextFunction): Promise<any> {
    try {
       const accessToken = req.cookies.accessToken;

       if (!accessToken) {
        return res.status(401).json({ content: "Unauthorized - No access token provided" });
      }

      try {
        const decoded: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
        const user = await User.findById(decoded.userId).select("-password");
  
        if (!user) {
          return res.status(401).json({ content: "User not found" });
        }
  
        req.user = user;
  
        next();
      } catch (error: any) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ content: "Unauthorized - Access token expired" });
        }
        throw error;
      }
    } catch(error: any) {
      return res.status(401).json({ content: "Unauthorized - Invalid access token" });
    }
  }

  public async adminRoute(req: Request | any, res: Response, next: NextFunction): Promise<any> {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ content: "Access denied - Admin only" });
    }
  }
}
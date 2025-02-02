import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../models/user.model';

export class AuthController {

  public async signUp(req: Request, res: Response): Promise<any> {
    try {
      const { email, password, name } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ content: "User already exists" });
      }

      const user = await User.create({ name, email, password });

      const { accessToken, refreshToken } = this.generateTokens(user._id);

      await this.storeRefreshToken(user._id, refreshToken);

      this.setCookies(res, accessToken, refreshToken);

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error: any) {
      res.status(500).json({ content: error.message });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user: any = await User.findOne({ email });
  
      if (user && (await user.comparePassword(password))) {
        const { accessToken, refreshToken } = this.generateTokens(user._id);
        await this.storeRefreshToken(user._id, refreshToken);
        this.setCookies(res, accessToken, refreshToken);
  
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } else {
        res.status(400).json({ content: "Invalid email or password" });
      }
    } catch (error: any) {
      res.status(500).json({ content: error.message });
    }
  }

  public async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
        // await redis.del(`refresh_token:${decoded.userId}`);
      }
  
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({ content: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async refreshToken(req: Request, res: Response): Promise<any> {
    try {
      const refreshToken = req.cookies.refreshToken;
  
      if (!refreshToken) {
        return res.status(401).json({ content: "No refresh token provided" });
      }
  
      const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
      // const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
  
      // if (storedToken !== refreshToken) {
      //   return res.status(401).json({ content: "Invalid refresh token" });
      // }
  
      const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
  
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
  
      res.json({ content: "Token refreshed successfully" });
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  public async getProfile(req: Request | any, res: Response) {
    try {
      res.json(req.user);
    } catch (error: any) {
      res.status(500).json({ content: "Server error", error: error.message });
    }
  }

  private generateTokens(userId: any) {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "15m",
    });
  
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    return { refreshToken, accessToken };
  }

  private async storeRefreshToken(userId: any, refreshToken: string) {
    // await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
  }

  private setCookies (res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }
}
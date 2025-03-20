import { AuthService } from "./auth.service";
import { Request, Response } from "express";

export class AuthController {
  private authService = new AuthService();

  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { id, password } = req.body;
      const tokens = await this.authService.signIn(id, password);
      res.json(tokens);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unkwon error";
      res.status(401).json({ message });
    }
  }

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, 99);
      const { id, password } = req.body;
      const tokens = await this.authService.signUp(id, password);
      console.log(tokens);
      res.json(tokens);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unkwon error";
      res.status(401).json({ message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.authService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unkwon error";
      res.status(401).json({ message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) await this.authService.logout(token);
    res.json({ message: "Logged out" });
  }

  async info(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token privided" });
      return;
    }
    const id = this.authService.getUserId(token);
    res.json({ id });
  }
}

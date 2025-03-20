import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/signin", authController.signIn.bind(authController));
authRoutes.post(
  "/signin/new_token",
  authController.refreshToken.bind(authController)
);
authRoutes.post("/signup", authController.signUp.bind(authController));
authRoutes.get(
  "/info",
  authMiddleware,
  authController.info.bind(authController)
);
authRoutes.get(
  "/logout",
  authMiddleware,
  authController.logout.bind(authController)
);

export { authRoutes };

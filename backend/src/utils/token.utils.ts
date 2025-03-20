import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

if (!JWT_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT_SECRET OR REFRESH_SECRET is not defined in .env file");
}

export const generateTokens = (id: string) => {
  const accessToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: "10m" });
  const refreshToken = jwt.sign({ id }, REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, isRefresh = false) => {
  return jwt.verify(token, isRefresh ? REFRESH_SECRET : JWT_SECRET) as {
    id: string;
  };
};

import { generateTokens, verifyToken } from "@/utils/token.utils";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class AuthService {
  private blockedTokens: Set<string> = new Set();

  async signIn(id: string, password: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    return generateTokens(id);
  }

  async signUp(id: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({ data: { id, password: hashedPassword } });
    return generateTokens(id);
  }

  async refreshToken(refreshToken: string) {
    if (this.blockedTokens.has(refreshToken)) {
      throw new Error("Token blocked");
    }
    const decoded = verifyToken(refreshToken, true);
    return generateTokens(decoded.id);
  }

  async logout(token: string) {
    this.blockedTokens.add(token);
  }

  getUserId(token: string) {
    const decoded = verifyToken(token);
    return decoded.id;
  }
}

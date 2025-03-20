import { verifyToken } from "@/utils/token.utils";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        res.status(401).json({ message: 'No token provided' })
        return
    }
    try {
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}
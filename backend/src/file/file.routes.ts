import { Router } from "express";
import { FileController } from "./file.controller";
import { authMiddleware } from "@/middleware/auth.middleware";

const fileRoutes = Router()
const fileController = new FileController()

fileRoutes.post('/upload', authMiddleware, fileController.upload.bind(fileController))
fileRoutes.get('/list', authMiddleware, fileController.list.bind(fileController))
fileRoutes.get('/:id', authMiddleware, fileController.get.bind(fileController))
fileRoutes.get('/download/:id', authMiddleware, fileController.download.bind(fileController))
fileRoutes.delete('/delete/:id', authMiddleware, fileController.delete.bind(fileController))
fileRoutes.put('/update/:id', authMiddleware, fileController.update.bind(fileController))

export { fileRoutes }
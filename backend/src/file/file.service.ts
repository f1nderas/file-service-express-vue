import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import { UploadedFile } from "express-fileupload";

const prisma = new PrismaClient();

export class FileService {
  async uploadFile(file: any, userId: string) {
    const { name, ext } = path.parse(file.name);
    const fullName = `${name}-${Date.now()}${ext}`;
    const filePath = path.join(__dirname, "../../uploads", fullName);
    await file.mv(filePath);
    const stats = await fs.stat(filePath);
    const createdFile = await prisma.file.create({
      data: {
        name,
        extension: ext,
        mimeType: file.mimetype,
        size: stats.size,
        uploadDate: new Date(),
        userId,
        fullName,
      },
    });

    return createdFile.id;
  }

  async listFiles(userId: string, listSize: number = 10, page: number = 1) {
    const skip = (page - 1) * listSize;
    return prisma.file.findMany({
      where: { userId },
      take: listSize,
      skip,
    });
  }

  async getFile(id: number, userId: string) {
    return prisma.file.findFirst({ where: { id, userId } });
  }

  async downloadFile(id: number, userId: string) {
    const file = await this.getFile(id, userId);
    if (!file) throw new Error("File not found");
    const filePath = path.join(__dirname, "../../uploads", file.fullName);
    const fileData = await fs.readFile(filePath);
    return {
      data: fileData,
      mimeType: file.mimeType,
      fullName: file.fullName,
    };
  }

  async deleteFile(id: number, userId: string) {
    const file = await this.getFile(id, userId);
    if (!file) throw new Error("File not found");
    await fs.unlink(path.join(__dirname, "../../uploads", file.fullName));
    await prisma.file.delete({ where: { id } });
  }

  async updateFile(id: number, file: UploadedFile, userId: string) {
    const oldFile = await this.getFile(id, userId);
    if (!oldFile) throw new Error("File not found");

    const oldFilePath = path.join(__dirname, "../../uploads", oldFile.fullName);
    await fs.unlink(oldFilePath);

    const { name, ext } = path.parse(file.name);
    const fullName = `${name}-${Date.now()}${ext}`;
    const filePath = path.join(__dirname, "../../uploads", fullName);
    await file.mv(filePath);
    const stats = await fs.stat(filePath);

    await prisma.file.update({
      where: { id },
      data: {
        name,
        extension: ext,
        mimeType: file.mimetype,
        size: stats.size,
        uploadDate: new Date(),
        fullName,
      },
    });
  }
}

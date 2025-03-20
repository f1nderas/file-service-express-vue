import { FileService } from "./file.service";
import { Request, Response } from "express";

export class FileController {
  private fileService = new FileService();

  async upload(req: Request, res: Response) {
    try {
      const file = req.files?.file;
      const userId = req.user!.id;
      const fileId = await this.fileService.uploadFile(file, userId);
      res.json({ id: fileId });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unkwon error";
      res.status(400).json(message);
    }
  }

  async list(req: Request, res: Response) {
    const listSize = parseInt(req.query.list_size as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const userId = req.user?.id;
    const files = await this.fileService.listFiles(userId, listSize, page);
    res.json(files);
  }

  async get(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const userId = req.user!.id;
    const file = await this.fileService.getFile(id, userId);
    if (!file) {
      res.status(400).json({ message: "File not found" });
      return;
    }
    res.json(file);
  }

  async download(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const fileData = await this.fileService.downloadFile(
        parseInt(id),
        userId
      );
      res.setHeader("Content-Type", fileData.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileData.fullName}"`
      );
      res.send(fileData.data);
    } catch (error) {
      res
        .status(404)
        .json({ message: (error as Error).message || "File not found" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      await this.fileService.deleteFile(id, userId);
      res.json({ message: "File deleted" });
    } catch (error) {
      console.error("Delete error: ", error);
      res
        .status(500)
        .json({ message: (error as Error).message || "Failed to delete file" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;

      if (!req.files || !req.files.file) {
        res.status(400).json({ message: "No file provide" });
        return;
      }

      const file = req.files.file;

      if (Array.isArray(file)) {
        res.status(400).json({ message: "Multiple files not supported" });
        return;
      }

      await this.fileService.updateFile(id, file, userId);
      res.json({ message: "File updated" });
    } catch (error) {
      console.error("Update error:", error);
      res
        .status(500)
        .json({ message: (error as Error).message || "Failed to update file" });
    }
  }
}

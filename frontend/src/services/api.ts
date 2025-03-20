import type { IFileItem, IToken } from "@/types";
import type { AxiosInstance } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:4200/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const { data } = await axios.post<IToken>(
          "/signin/new_token",
          { refreshToken },
          { baseURL: "http://localhost:4200/api" }
        );
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signIn: (id: string, password: string) =>
    api.post<IToken>("/signin", { id, password }),
  signUp: (id: string, password: string) =>
    api.post<IToken>("/signup", { id, password }),
  logout: () => api.get("/logout"),
  getInfo: () => api.get<{ id: string }>("/info"),
};

export const fileService = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log("Upload file:", file);
    return api.post<{ id: number }>("/file/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getFileList: (listSize = 10, page = 1) =>
    api.get<IFileItem[]>(`/file/list?list_size=${listSize}&page=${page}`),
  getFileInfo: (id: number) => api.get<IFileItem>(`/file/${id}`),
  downloadFile: (id: number) =>
    api.get(`/file/download/${id}`, { responseType: "blob" }),
  deleteFile: (id: number) => api.delete(`/file/delete/${id}`),
  updatefile: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.put(`/file/update/${id}`, formData, {
      headers: {
        "Content-Type": "mulipart/form-data",
      },
    });
  },
};

export { api };

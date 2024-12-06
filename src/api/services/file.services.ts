import api from "api/api";
import {
  UploadedFile,
  Shared,
  Stats,
  UploadFile,
  File,
} from "interfaces/file.model";

export const getUploadedFiles = async (): Promise<UploadedFile[]> => {
  const response = await api.get<UploadedFile[]>("/files");
  return response.data;
};

export const getShareableFile = async (id: any): Promise<Shared> => {
  let queryId = id.queryKey[0];
  const response = await api.get<Shared>(`files/share/${queryId}`);
  return response.data;
};

export const getFile = async (id: any): Promise<File> => {
  let queryId = id.queryKey[0];
  const response = await api.get<File>(`files/view/${queryId}`);
  return response.data;
};

export const getFileStats = async (id: any): Promise<Stats> => {
  let queryId = id.queryKey[0];
  const response = await api.get<Stats>(`files/stats/${queryId}`);
  return response.data;
};

export const uploadFileFunc = async (
  data: UploadFile
): Promise<UploadedFile> => {
  const formData = new FormData();
  if (data.file) {
    formData.append("file", data.file);
  }
  formData.append("tags", data.tags.join(","));
  const response = await api.post<UploadedFile>("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

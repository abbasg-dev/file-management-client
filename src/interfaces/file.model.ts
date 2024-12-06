export interface UploadedFile {
  _id: string;
  filename: string;
  path: string;
  tags: string[];
  uploadedBy: string;
  sharedLink: string;
  views: Number;
  createdAt: Date;
}

export interface Shared {
  sharedLink: string;
}

export interface Stats {
  filename: string;
  views: Number;
  uploadedAt: Date;
  tags: string[];
}

export interface UploadFile {
  file: globalThis.File | null;
  tags: string[];
}

export interface File {
  fileUrl: string;
}

export interface UploadFileRequest {
  file: File;
  tags: string[];
}

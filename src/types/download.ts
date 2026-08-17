export interface DownloadItem {
  id: string;
  title: string;
  category: string;
  fileType: "pdf" | "docx" | "xlsx";
  fileSize: string;
  updatedDate: string;
  description: string;
  fileUrl: string;
}

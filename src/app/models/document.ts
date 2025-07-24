export interface Document {
  id: number;
  name: string;
  description?: string;
  category:string;
  fileExtension:string;
  insertDate: Date;
  fileUrl: string; 
  status?: DocumentStatus;
  size?: string;
}


export type DocumentStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

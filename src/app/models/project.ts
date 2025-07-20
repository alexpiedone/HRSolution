export interface Project {
  id: number;
  name: string;
  status: string;
}

export interface UserProject{
  id: number;
  name: string;
  status: string;
  position: string;
  dueDate: Date;
}

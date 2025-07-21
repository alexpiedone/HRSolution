export interface Project {
  id: number;
  name: string;
  status: string;
  description?: string; // Opțional, dacă vrei să adaugi descrierea
  dueDate?: Date; // Poate fi un string în format ISO sau un Date object
}

export interface UserProject{
  id: number;
  name: string;
  status: string;
  position: string;
  dueDate: Date;
}

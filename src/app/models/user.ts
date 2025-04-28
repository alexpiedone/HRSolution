
export interface User {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    responsibilities?: string;
    projects: string[];
  }
  

export interface Colleague {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    responsibilities?: string;
    projects: string[];
  }
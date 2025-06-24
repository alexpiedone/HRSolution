
export interface User {
    id: string;
    fullName: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    dateJoined?: Date;
  }

  export interface UserRoleInfo{
    position: string;
    department: string;
    team: string;
    manager: string;
  }
  
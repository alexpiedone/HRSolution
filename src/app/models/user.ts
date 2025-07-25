
export interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    dateJoined?: Date;
  }

  export interface UserProfileUpdateDTO {
  id: number; 
  email?: string; 
  phone?: string;
  // firstName?: string;
  // lastName?: string;
}


  export interface UserRoleInfo{
    position: string;
    positionId: number | null ;
    department: string;
    departmentId: number | null;
    team: string;
    teamId: number | null;
    manager: string;
    managerId: number | null;
  }

  export interface UpdateRoleDto {
    positionId?: number | null;
    departmentId?: number | null;
    teamId?: number | null;
    managerId?: number | null;
  }
  
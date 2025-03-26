import { BaseEntity } from "./base-entity";

export interface Leave extends BaseEntity{
    employeeId: number;
    startDate: Date;
    endDate: Date;
    type: string; // Tipul de concediu (CO, CM, etc.)
    status: string; // Starea cererii (aprobat, respins, în așteptare)
    reason?: string; // Motivul concediului (opțional)
    approvedBy?: number; // ID-ul managerului care a aprobat cererea (opțional)
    approvedDate?: Date; // Data aprobării (opțional)
  }
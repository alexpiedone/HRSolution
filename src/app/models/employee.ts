import { BaseEntity } from "./base-entity";

export interface Employee extends BaseEntity{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    department: string;
    position: string;
    startDate: Date;
    endDate?: Date; // Opțional, pentru angajații care nu mai lucrează în companie
    salary: number;
    currency: string;
    employmentType: string; // Full-time, part-time, contract, etc.
    managerId?: number; // Opțional, ID-ul managerului angajatului
    reportsTo?: string; // Numele managerului angajatului
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
    socialSecurityNumber: string;
    taxIdentificationNumber: string;
    bankAccountNumber: string;
    bankName: string;
    iban: string;
    swift: string;
    profilePictureUrl?: string; 
    notes?: string; 
    status: string; 
  }
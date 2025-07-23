import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from '../../core/services/logging.service';
import { UpdateRoleDto, User, UserProfileUpdateDTO, UserRoleInfo } from '../../models/user';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Injectable } from '@angular/core';
import { Responsibility } from '../hr/responsability';
import { Project, UserProject } from '../../models/project';
import { Benefit } from '../../models/benefit';
import { Document } from '../../models/document';
import { Salary } from '../../models/salary';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ApiService<User> {

  constructor(http: HttpClient, loggingService: LoggingService) {
    super(http, loggingService, `Users`);
  }
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/Projects/GetAll`).pipe(
      map((projects: Project[]) => {
        return projects.map(project => ({
          id: project.id,
          name: project.name,
          status: project.status,
          dueDate: project.dueDate
        }));
      })
    );
  }

  updateUserAssignedProjects(userId: number, projectIds: number[]): Observable<any> {
    return this.http.put(`${environment.apiUrl}/${userId}/assigned-projects`, projectIds);
  }

  updateUserInfo(userId: number, data: UserProfileUpdateDTO): Observable<any> {
    const url = `${environment.apiUrl}/Users/${userId}/contact`;
    return this.http.patch(url, data);
  }

  updateUserRoleInfo(userId: number, roleDto: UpdateRoleDto): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/Users/${userId}/role`, roleDto);
  }

  getColleagues(id: number): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/Users/${id}/colleagues`).pipe(
      map(users =>
        users.map(u => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          avatar: u.avatarUrl
        }))
      )
    );
  }

  getUserInfo(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/Users/${id}/basicinfo`).pipe(
      map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        dateJoined: user.dateJoined,
      }))
    );
  }

  getUserRoleInfo(id: number): Observable<UserRoleInfo> {
    return this.http.get<UserRoleInfo>(`${environment.apiUrl}/Users/${id}/roleinfo`).pipe(
      map(roleinfo => ({
        position: roleinfo.position,
        positionId: roleinfo.positionId,
        department: roleinfo.department,
        departmentId: roleinfo.departmentId,
        team: roleinfo.team,
        teamId: roleinfo.teamId,
        manager: roleinfo.manager,
        managerId: roleinfo.managerId
      }))
    );
  }

  getUserResponsibilities(id: number): Observable<Responsibility[]> {
    return this.http.get<Responsibility[]>(`${environment.apiUrl}/Responsabilities/${id}`).pipe(
      map((responsibilities: Responsibility[]) => {
        return responsibilities.map(responsibility => ({
          id: responsibility.id,
          description: responsibility.description
        }));
      })
    );
  }
  updateUserResponsibilities(userId: number, responsibilitiesIDs: number[]): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Users/${userId}/responsibilities`, responsibilitiesIDs);
  }

  getUserProjects(id: number): Observable<UserProject[]> {
    return this.http.get<UserProject[]>(`${environment.apiUrl}/Users/${id}/projects`).pipe(
      map((projects: UserProject[]) => {
        return projects.map(project => ({
          id: project.id,
          name: project.name,
          status: project.status,
          position: project.position,
          dueDate: project.dueDate
        }));
      })
    );
  }

  updateUserProjects(userId: number, projects: number[]): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Users/${userId}/update-projects`, projects);
  }

  getUserBenefits(id: number): Observable<Benefit[]> {
    return this.http.get<Benefit[]>(`${environment.apiUrl}/Users/${id}/benefits`).pipe(
      map((benefits: Benefit[]) => {
        return benefits.map(benefit => ({
          id: benefit.id,
          name: benefit.name,
          description: benefit.description,
          icon: benefit.icon,
          color: benefit.color
        }));
      })
    );
  }

  updateUserBenefits(userId: number, benefits: Benefit[]): Observable<any> {
    return this.http.put(`${environment.apiUrl}/Users/${userId}/benefits`, benefits);
  }

  getUserDocuments(id: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${environment.apiUrl}/Users/${id}/documents`).pipe(
      map((documents: Document[]) => {
        return documents.map(document => ({
          name: document.name,
          category: document.category,
          type: document.type,
          date: document.date
        }));
      })
    );
  }

  getUserCurrentSalary(id: number): Observable<Salary> {
    return this.http.get<Salary>(`${environment.apiUrl}/Users/${id}/salary/current`).pipe(
      map((salary: Salary) => {
        return {
          grossMonthly: salary.grossMonthly,
          netMonthly: salary.netMonthly,
          annualBonus: salary.annualBonus,
          lastReview: salary.lastReview
        };
      })
    );
  }

}

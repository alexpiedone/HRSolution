import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from '../../core/services/logging.service';
import { User, UserRoleInfo } from '../../models/user';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Injectable } from '@angular/core';
import { Responsibility } from '../hr/responsability';
import { Project, UserProject } from '../../models/project';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ApiService<User> {

  constructor(http: HttpClient, loggingService: LoggingService) {
    super(http, loggingService, `Users`);
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
        department: roleinfo.department,
        team: roleinfo.team,
        manager: roleinfo.manager
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
   getUserProjects(id: number): Observable<UserProject[]> {
    return this.http.get<UserProject[]>(`${environment.apiUrl}/Users/${id}/projects`).pipe(
      map((projects: UserProject[]) => { 
        return projects.map(project => ({
          name: project.name,
          status: project.status,
          position: project.position,
          dueDate: project.dueDate
        }));
      })
    );
  }

}

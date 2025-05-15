import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from '../../core/services/logging.service';
import {  User } from '../../models/user';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class UsersService extends ApiService<User> {

  constructor(http: HttpClient, loggingService: LoggingService) {
    super(http, loggingService, `News`);
  }

  getColleagues(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/Users/GetColleagues`).pipe(
      map(users =>
        users.map(u => ({
          id: u.id,
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          avatar: u.avatarUrl,
          responsibilities: u.responsibilities,
          projects: u.projects
        }))
      )
    );
  }

}

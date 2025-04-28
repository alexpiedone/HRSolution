import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from '../../core/services/logging.service';
import { Colleague, User } from '../../models/user';
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

  getColleagues(): Observable<Colleague[]> {
    return this.http.get<Colleague[]>(`${environment.apiUrl}/Users/GetColleagues`).pipe(
      map(users =>
        users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          avatarUrl: u.avatarUrl,
          responsibilities: u.responsibilities,
          projects: u.projects
        }))
      )
    );
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsItem } from '../models/newsitem';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private baseUrl = 'http://localhost:5186/api/News';

  constructor(private http: HttpClient) {}

  getAllNews(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>(`${this.baseUrl}/GetAll`);
  }
}

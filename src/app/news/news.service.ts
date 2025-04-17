import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewsItem } from '../models/newsitem';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private baseUrl = 'https://localhost:7124/api/News';

  constructor(private http: HttpClient) {}

  getAllNews(): Observable<NewsItem[]> {
    console.log('se aduc news items');
    return this.http.get<NewsItem[]>(`${this.baseUrl}/GetAll`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewsItem } from '../../../models/newsitem';
import { ApiService } from '../../api.service';
import { environment } from '../../../../environment/environment';

@Injectable({providedIn: 'root'})
export class NewsService extends ApiService<NewsItem> {

  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/News`);
  }

}

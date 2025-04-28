import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewsItem } from '../../models/newsitem';
import { ApiService } from '../../core/services/api.service';
import { LoggingService } from '../../core/services/logging.service';
@Injectable({providedIn: 'root'})
export class NewsService extends ApiService<NewsItem> {

  constructor(http: HttpClient, loggingService: LoggingService) {
    super(http, loggingService, `News`);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { LoggingService } from '../../core/services/logging.service';
import { Event } from '../../models/event';
@Injectable({providedIn: 'root'})
export class EventsService extends ApiService<Event> {

  constructor(http: HttpClient, loggingService: LoggingService) {
    super(http, loggingService, `events`);
  }

}

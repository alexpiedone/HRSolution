import { HttpClient } from "@angular/common/http";
import { ApiService } from "../../core/services/api.service";
import { Task } from "../../models/task";
import { LoggingService } from "../../core/services/logging.service";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TaskService extends ApiService<Task>{
      constructor(http: HttpClient, loggingService: LoggingService) {
        super(http, loggingService, `Tasks`);
      }
}
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TimesheetEntry {
  status: 'worked' | 'holiday';
  hours: number;
  workType: 'office' | 'home' | 'departure' | null;
  requestId: string | null;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isToday: boolean;
  isFiltered: boolean;
  entry?: TimesheetEntry;
}

interface Summary {
  totalHours: number;
  officeDays: number;
  remoteDays: number;
  departureDays: number;
}

@Component({
  selector: 'app-timesheet',
  imports: [CommonModule, FormsModule],
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  currentMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];
  timesheetData: { [key: string]: TimesheetEntry } = {
    // Current week (Monday to Friday)
    "2023-11-20": { 
      status: "worked",
      hours: 8,
      workType: "office",
      requestId: null
    },
    "2023-11-21": {
      status: "worked",
      hours: 7.5,
      workType: "home",
      requestId: null
    },
    "2023-11-22": {
      status: "worked",
      hours: 4,
      workType: "departure",
      requestId: "req-22345"
    },
    "2023-11-23": {
      status: "holiday",
      hours: 0,
      workType: null,
      requestId: "req-33456"
    },
    "2023-11-24": {
      status: "worked",
      hours: 6,
      workType: "home",
      requestId: null
    },
  
    // Previous week examples
    "2023-11-13": {
      status: "worked",
      hours: 8,
      workType: "office",
      requestId: null
    },
    "2023-11-14": {
      status: "worked",
      hours: 8,
      workType: "office",
      requestId: null
    }
  };
  
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  statusFilter = 'all';
  workTypeFilter = 'all';
  
  showEditModal = false;
  currentEditDate: CalendarDay | null = null;
  editForm = {
    status: 'worked',
    hours: 8,
    workType: 'office',
    requestId: ''
  };
  
  summary: Summary = {
    totalHours: 0,
    officeDays: 0,
    remoteDays: 0,
    departureDays: 0
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTimesheetData();
  }

  fetchTimesheetData(): void {
    // Replace with your actual API endpoint
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth() + 1;
    const apiUrl = `/api/timesheet?year=${year}&month=${month}`;
    
  
    this.renderCalendar();
     
  }

  renderCalendar(): void {
    this.calendarDays = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get days from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDate = prevMonthDays - firstDay + i + 1;
      const date = new Date(year, month - 1, prevMonthDate);
      
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isToday: this.isSameDate(date, new Date()),
        isFiltered: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = this.formatDateKey(date);
      const entry = this.timesheetData[dateString];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isToday = this.isSameDate(date, new Date());
      
      // Apply filters
      let isFiltered = false;
      if (entry) {
        if (this.statusFilter !== 'all' && entry.status !== this.statusFilter) {
          isFiltered = true;
        }
        if (this.workTypeFilter !== 'all' && entry.workType !== this.workTypeFilter) {
          isFiltered = true;
        }
      }
      
      this.calendarDays.push({
        date,
        isCurrentMonth: true,
        isWeekend,
        isToday,
        isFiltered,
        entry
      });
    }

    // Next month days
    const totalCells = 42; // 6 rows of 7 days
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      
      this.calendarDays.push({
        date,
        isCurrentMonth: false,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isToday: this.isSameDate(date, new Date()),
        isFiltered: false
      });
    }
    console.log(this.calendarDays);
    this.updateSummary();
  }

  updateSummary(): void {
    this.summary = {
      totalHours: 0,
      officeDays: 0,
      remoteDays: 0,
      departureDays: 0
    };

    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth() + 1;
    const monthKey = String(month).padStart(2, '0');
    
    for (const [date, entry] of Object.entries(this.timesheetData)) {
      if (date.startsWith(`${year}-${monthKey}`)) {
        this.summary.totalHours += entry.hours;
        
        if (entry.workType === 'office') {
          this.summary.officeDays++;
        } else if (entry.workType === 'home') {
          this.summary.remoteDays++;
        } else if (entry.workType === 'departure') {
          this.summary.departureDays++;
        }
      }
    }
  }

  prevMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.fetchTimesheetData();
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.fetchTimesheetData();
  }

  goToToday(): void {
    this.currentMonth = new Date();
    this.fetchTimesheetData();
  }

  applyFilters(): void {
    this.renderCalendar();
  }

  openEditModal(day: CalendarDay): void {
    this.currentEditDate = day;
    const entry = day.entry || { 
      status: 'worked', 
      hours: 8, 
      workType: 'office', 
      requestId: null 
    };
    
    this.editForm = {
      status: entry.status,
      hours: entry.hours,
      workType: entry.workType || 'office',
      requestId: entry.requestId || ''
    };
    
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentEditDate = null;
  }

  saveEdit(): void {
    if (!this.currentEditDate) return;
    
    const dateString = this.formatDateKey(this.currentEditDate.date);
    const status = this.editForm.status;
    
    this.timesheetData[dateString] = {
      status: 'worked',
      hours: status === 'holiday' ? 0 : this.editForm.hours,
      workType: 'office',
      requestId: status === 'holiday' ? null : this.editForm.requestId
    };
    
    // Here you would typically call an API to save the changes
    this.saveTimesheetEntry(dateString, this.timesheetData[dateString]);
    
    this.closeEditModal();
    this.renderCalendar();
  }

  saveTimesheetEntry(date: string, entry: TimesheetEntry): void {
    // Replace with your actual API endpoint
    this.http.post('/api/timesheet', { date, entry }).subscribe(
      () => {
        console.log('Timesheet entry saved successfully');
      },
      error => {
        console.error('Error saving timesheet entry:', error);
      }
    );
  }

  private formatDateKey(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}
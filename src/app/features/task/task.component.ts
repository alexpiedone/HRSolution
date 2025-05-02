import { Component ,Input,Output, EventEmitter} from '@angular/core';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-task',
  imports: [CommonModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input() tasks: Task[] = [];
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<string>();
  @Output() taskAction = new EventEmitter<any>();
  @Output() addTaskRequested = new EventEmitter<void>();

  filteredTasks: Task[] = [];
  selectedPriority: string = 'all';
  currentFilter: string = 'all';
  completedCount: number = 0;

  ngOnChanges() {
    this.filterTasks(this.currentFilter);
    this.updateCounters();
  }

  filterTasks(filter: string) {
    this.currentFilter = filter;
    
    this.filteredTasks = this.tasks.filter(task => {
      // Status filter
      const statusMatch = 
        filter === 'all' || 
        (filter === 'active' && task.status !== 'Completed') || 
        (filter === 'completed' && task.status === 'Completed');
      
      // Priority filter
      const priorityMatch = 
        this.selectedPriority === 'all' || 
        task.priority.toLowerCase() === this.selectedPriority;
      
      return statusMatch && priorityMatch;
    });
  }

  toggleTaskStatus(task: Task) {
    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    this.taskUpdated.emit(task);
    this.updateCounters();
  }

  deleteTask(task: Task) {
    this.taskDeleted.emit(task.name);
  }

  handleAction(action: any) {
    this.taskAction.emit(action);
  }

  openAddTaskModal() {
    this.addTaskRequested.emit();
  }

  clearCompleted() {
    const completedTasks = this.tasks.filter(t => t.status === 'Completed');
    completedTasks.forEach(t => this.taskDeleted.emit(t.name));
  }

  getActionIcon(actionType: string): string {
    switch(actionType) {
      case 'redirect': return 'pi pi-external-link';
      case 'button': return 'pi pi-play';
      default: return 'pi pi-info-circle';
    }
  }

  private updateCounters() {
    this.completedCount = this.tasks.filter(t => t.status === 'Completed').length;
  }
}

import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'task-lists',
  templateUrl: './task-lists.component.html',
  styleUrls: ['./task-lists.component.css'],
})
export class TaskListsComponent implements OnInit {
  taskList = [];
  filterValue: string = 'all';

  constructor(
    private dataService: DataService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.showTask();
    this.dataService.taskRefresh$.subscribe(() => {
      this.showTask();
    });
  }
  showTask() {
    this.apiService.getTaskFromApi().subscribe({
      next: (tasks: any[]) => {
        // Add API tasks to the existing list
        this.apiService.taskLists = [...tasks];
        this.taskList = [...tasks];
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      },
    });
  }

  //Getting status of the edit mode
  getEditMode() {
    return this.dataService.getEditState();
  }

  deleteTask(index: number) {
    this.apiService.deleteTask(index).subscribe({
      next: () => {
        this.showTask();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // Open AddTaskComponent in Edit Mode
  onEditTask(index: number) {
    const taskToEdit = this.taskList[index];
    this.dataService.setEditTask(taskToEdit, index);
  }
}

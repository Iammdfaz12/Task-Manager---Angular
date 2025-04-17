import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'add-tasks',
  templateUrl: './add-tasks.component.html',
  styleUrls: ['./add-tasks.component.css'],
})
export class AddTasksComponent implements OnInit {
  taskForm!: FormGroup;
  private editSub!: Subscription;
  // taskStatusValue: string = 'Not Started';

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.taskForm = this.fb.group({
      taskTitle: ['', Validators.required],
      taskDesc: ['', Validators.required],
      taskStartDate: ['', Validators.required],
      taskEndDate: ['', Validators.required],
      taskStatus: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.editSub = this.dataService.taskUpdated$.subscribe(() => {
      if (this.dataService.getEditState()) {
        const editData = this.dataService.getEditTask();
        this.prefillForm(editData.task);
      } else {
        this.taskForm.reset();
      }
    });
    this.LoadTask();
  }

  LoadTask() {
    this.apiService.getTaskFromApi().subscribe({
      next: () => {
        console.log('Page is refreshed');
      },
      error: (error) => {
        console.log('Page is not refreshed');
      },
    });
  }
  prefillForm(taskData: any) {
    this.taskForm.patchValue({
      taskTitle: taskData.taskTitle,
      taskDesc: taskData.taskDesc,
      taskStatus: taskData.taskStatus,
      taskStartDate: this.formatDateForInput(taskData.taskStartDate),
      taskEndDate: this.formatDateForInput(taskData.taskEndDate),
    });
  }

  private formatDateForInput(dateString: string | Date): string {
    // Convert date to YYYY-MM-DD format for HTML date input
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  ngOnDestroy() {
    if (this.editSub) {
      this.editSub.unsubscribe();
    }
  }

  //Getting status of the edit mode
  getEditMode() {
    return this.dataService.getEditState();
  }

  toggleModal() {
    this.dataService.toggleModal();
  }

  isModalOpen() {
    return this.dataService.getModalState();
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      if (this.dataService.getEditState()) {
        const editData = this.dataService.getEditTask();
        this.dataService.updateTask(editData.index, taskData);
      } else {
        let id = this.apiService.displayTasks().length + 1;
        this.apiService.createTask(taskData, id).subscribe({
          next: () => {
            this.dataService.triggerTaskRefresh();
          },
          error: (error) => {
            console.error('Error in creating task: ', error);
          },
        });
      }

      this.taskForm.reset();
      this.toggleModal();
    }
  }

  onModalClose() {
    this.taskForm.reset();
    if (this.dataService.getEditState()) {
      this.dataService.setEditMode(false);
    }
    this.dataService.toggleModal();
  }
}

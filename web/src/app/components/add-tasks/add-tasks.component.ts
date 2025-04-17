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
    console.log(date);
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
        let index = this.dataService.displayTasks().length + 1;
        console.log(index);
        console.log(taskData);
        
        this.apiService.createTask(taskData, index);
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

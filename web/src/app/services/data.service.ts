import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  addTaskModal: boolean = false;
  editMode: boolean = false;
  taskLists: any = [];
  selectedTask: any = null;
  selectedTaskIndex: number | null = null;
  filterValue: string = 'all';

  private taskUpdated = new Subject<void>();
  taskUpdated$ = this.taskUpdated.asObservable();

  private taskRefreshNeeded = new Subject<void>();
  taskRefresh$ = this.taskRefreshNeeded.asObservable();

  constructor() {}

  triggerTaskRefresh() {
    this.taskRefreshNeeded.next();
  }

  toggleModal() {
    this.addTaskModal = !this.addTaskModal;

    //if the addTask modal is true and edit modal is false
    if (!this.addTaskModal && this.editMode) {
      //reset the edit state(task inputs)
      this.resetEditState();
    }
  }

  //It will return the modal state (true/false)
  getModalState() {
    return this.addTaskModal;
  }

  // It adds the task in taskList array
  addTask(task: any) {
    this.taskLists.push(task);
    this.taskUpdated.next();
  }

  // Returns all the tasks in taskList array
  displayTasks() {
    return [...this.taskLists];
  }

  // Delete task
  deleteTask(index: number) {
    this.taskLists.splice(index, 1);
    this.taskUpdated.next();
  }

  setEditMode(editMode: boolean) {
    this.editMode = editMode;
  }

  // It gives the state of the edit mode
  getEditState() {
    return this.editMode;
  }

  // It takes the particular task to edit
  // (It stores the task in selectedTask and stores the index in selectedTaskNumber)
  setEditTask(task: any, index: number) {
    this.selectedTask = { ...task };
    this.selectedTaskIndex = index;
    this.editMode = true;
    this.addTaskModal = true;
    this.taskUpdated.next();
  }

  getEditTask() {
    return { task: this.selectedTask, index: this.selectedTaskIndex };
  }

  updateTask(index: number | null, updatedTask: any) {
    if (index !== null && index >= 0 && index < this.taskLists.length) {
      this.taskLists[index] = updatedTask;
      this.taskUpdated.next();
    }
    
    this.resetEditState();
  }

  private resetEditState() {
    this.selectedTask = null;
    this.selectedTaskIndex = null;
    this.editMode = false;
  }
}

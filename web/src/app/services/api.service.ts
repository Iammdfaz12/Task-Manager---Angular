import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  taskLists: any[] = [];

  constructor(private http: HttpClient) {}

  // Returns all the tasks in taskList array
  displayTasks() {
    return [...this.taskLists];
  }

  // Getting all the task from the backend (GET Method)
  getTaskFromApi(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Creating task (POST Method)
  createTask(task: any, id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any[]>(
      this.apiUrl,
      JSON.stringify({ ...task, id: id }),
      {
        headers,
      }
    );
  }

  //Update the existing task (PUT Method)

  updateTask(updatedTask: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${updatedTask.id}`, updatedTask);
  }

  // Delete the task (DELETE Method)

  deleteTask(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.apiUrl}/${id}`);
  }
}

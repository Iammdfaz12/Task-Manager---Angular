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

  getTaskFromApi() {
    return this.http.get(`${this.apiUrl}`);
  }

  createTask(task: any, id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log(task, id);
    return this.http.post(this.apiUrl, JSON.stringify({ ...task, id: id }), {headers}); 
  }
}

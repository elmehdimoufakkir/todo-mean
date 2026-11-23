import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Task } from '../models/task';

@Injectable({
    providedIn: 'root'
})

export class TaskService {

    private apiUrl = 'http://localhost:5000/tasks';

    constructor(private http: HttpClient) {}


    // 1. Récupérer toutes les tâches
    getTasks(): Observable<Task[]> {

        return this.http.get<Task[]>(this.apiUrl);

    }


    // 2. Ajouter une tâche
    addTask(task: { title: string; description: string }): Observable<Task> {

        return this.http.post<Task>(this.apiUrl, task);

    }


    // 3. Modifier une tâche
    updateTask(id: string, task: Partial<Task>): Observable<Task> {

        return this.http.put<Task>(
            `${this.apiUrl}/${id}`,
            task
        );

    }


    // 4. Supprimer une tâche
    deleteTask(id: string): Observable<{ message: string }> {

        return this.http.delete<{ message: string }>(
            `${this.apiUrl}/${id}`
        );

    }

}
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';

import { Task } from '../../models/task';

import { TaskService } from '../../services/task.service';


@Component({

    selector: 'app-tasks',

    standalone: true,

    imports: [
        CommonModule,
        ReactiveFormsModule
    ],

    templateUrl: './tasks.component.html',

    styleUrls: ['./tasks.component.css']

})


export class TasksComponent implements OnInit {


    // Liste des tâches
    tasks: Task[] = [];

    // Formulaire
    taskForm: FormGroup;

    // Indique si une tâche est en cours de modification
    editingTaskId: string | null = null;

    // Indicateur de chargement
    loading = true;

    // Message d'erreur
    errorMessage = '';


    constructor(

        private fb: FormBuilder,

        private taskService: TaskService

    ) {

        // Création du formulaire
        this.taskForm = this.fb.group({

            title: ['', [
                Validators.required,
                Validators.maxLength(100)
            ]],

            description: ['']

        });

    }


    // Fonction exécutée au démarrage du composant
    ngOnInit(): void {

        this.loadTasks();

    }


    // 1. Afficher toutes les tâches
    loadTasks(): void {

        this.loading = true;

        this.taskService.getTasks().subscribe({

            next: (data) => {

                this.tasks = data;

                this.loading = false;

            },

            error: (error) => {

                this.errorMessage = 'Impossible de récupérer les tâches';

                this.loading = false;

                console.error(error);

            }

        });

    }


    // Réinitialiser le formulaire
    resetForm(): void {

        this.editingTaskId = null;

        this.taskForm.reset({

            title: '',

            description: ''

        });

    }


    // 2. Ajouter ou modifier une tâche
    onSubmit(): void {

        if (this.taskForm.invalid) {

            this.taskForm.markAllAsTouched();

            return;

        }

        const data = {

            title: String(this.taskForm.value.title ?? '').trim(),

            description: String(
                this.taskForm.value.description ?? ''
            ).trim()

        };

        this.errorMessage = '';


        // Si une tâche est en cours de modification
        if (this.editingTaskId) {

            this.taskService.updateTask(
                this.editingTaskId,
                data
            ).subscribe({

                next: () => {

                    this.resetForm();

                    this.loadTasks();

                },

                error: (error) => {

                    this.errorMessage = 'Erreur lors de la modification';

                    console.error(error);

                }

            });

        }

        // Sinon, ajouter une nouvelle tâche
        else {

            this.taskService.addTask(data).subscribe({

                next: () => {

                    this.resetForm();

                    this.loadTasks();

                },

                error: (error) => {

                    this.errorMessage = 'Erreur lors de l’ajout';

                    console.error(error);

                }

            });

        }

    }


    // 3. Préparer la modification d'une tâche
    editTask(task: Task): void {

        this.editingTaskId = task._id;

        this.taskForm.patchValue({

            title: task.title,

            description: task.description

        });

    }


    // 4. Marquer une tâche comme terminée ou non terminée
    toggleCompleted(task: Task): void {

        this.taskService.updateTask(

            task._id,

            {
                completed: !task.completed
            }

        ).subscribe({

            next: () => {

                this.loadTasks();

            },

            error: (error) => {

                this.errorMessage = 'Erreur lors du changement de statut';

                console.error(error);

            }

        });

    }


    // 5. Supprimer une tâche
    deleteTask(task: Task): void {

        const confirmation = window.confirm(
            'Voulez-vous vraiment supprimer cette tâche ?'
        );

        if (!confirmation) {

            return;

        }

        this.taskService.deleteTask(task._id).subscribe({

            next: () => {

                if (this.editingTaskId === task._id) {

                    this.resetForm();

                }

                this.loadTasks();

            },

            error: (error) => {

                this.errorMessage = 'Erreur lors de la suppression';

                console.error(error);

            }

        });

    }


    // Annuler la modification
    cancelEdit(): void {

        this.resetForm();

    }

}
import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../../core/services/task/task-service';
import { ActivatedRoute } from '@angular/router';
import { Tasks } from '../../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-board',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
})
export class TaskBoard {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);

  projectId = signal<number>(0);
  tasks = signal<Tasks[]>([]);

  // חלוקת המשימות לעמודות באמצעות Computed Signals
  todoTasks = computed(() => this.tasks().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.tasks().filter(t => t.status === 'in-progress'));
  doneTasks = computed(() => this.tasks().filter(t => t.status === 'done'));

  newTaskTitle = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId.set(+params['projectId']);
      this.loadTasks();
    });
  }

  loadTasks() {
    this.taskService.getTasks(this.projectId()).subscribe(data => this.tasks.set(data));
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    const taskData: Partial<Tasks> = {
      project_id: this.projectId(),
      title: this.newTaskTitle,
      status: 'todo',
      priority: 'medium'
    };

    this.taskService.createTask(taskData).subscribe(newTask => {
      this.tasks.update(prev => [...prev, newTask]);
      this.newTaskTitle = '';
    });
  }

  changeStatus(task: Tasks, newStatus: string) {
  this.taskService.updateTask(task.id, { statues: newStatus }).subscribe({
    next: (updatedTask) => {
      this.tasks.update(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    },
    error: (err) => console.error('שגיאה בעדכון הסטטוס', err)
  });
}

// פונקציית עדכון עדיפות (Priority)
changePriority(task: Tasks, newPriority: string) {
  this.taskService.updateTask(task.id, { priority: newPriority }).subscribe(updatedTask => {
    this.tasks.update(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  });
}

  deleteTask(id: number) {
    if (confirm('בטוח שברצונך למחוק משימה זו?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.tasks.update(prev => prev.filter(t => t.id !== id));
      });
    }
  }
}

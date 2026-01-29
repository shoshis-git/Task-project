import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../../core/services/task/task-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Tasks } from '../../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsComponent } from '../../comments/comments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-board',
  imports: [CommonModule, FormsModule, CommentsComponent],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
})
export class TaskBoard {
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);

  projectId = signal<number>(0);
  tasks = signal<Tasks[]>([]);


  todoTasks = computed(() => this.tasks().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.tasks().filter(t => t.status === 'in-progress'));
  doneTasks = computed(() => this.tasks().filter(t => t.status === 'done'));

  newTaskTitle = '';
  isListView: any;

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
    if (!this.newTaskTitle.trim()) {        Swal.fire({
          icon: 'error',
          title: 'פעולה נכשלה',
          text: 'נא להזין כותרת למשימה' ,
          confirmButtonColor: '#6366f1'
        });return};
    const taskData = {
      projectId: Number(this.projectId()),
      title: this.newTaskTitle,
      status: 'todo',
      priority: 'medium'
    };

    this.taskService.createTask(taskData).subscribe(newTask => {
      this.tasks.update(prev => [...prev, newTask]);
      this.newTaskTitle = '';
      Swal.fire({
        icon: 'success',
        title: 'משימה נוספה בהצלחה!',
        confirmButtonColor: 'linear-gradient(135deg, #6366f1, #a855f7)',
        timer: 2000
      });
    });
  }

  changeStatus(task: Tasks, newStatus: string) {
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: (updatedTask) => {

        this.tasks.update(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'פעולה נכשלה',
          text: err.error?.error || 'שגיאה כללית בהוספת משימה',
          confirmButtonColor: '#6366f1'
        });
      }
    });
  }


  changePriority(task: Tasks, newPriority: string) {
    this.taskService.updateTask(task.id, { priority: newPriority }).subscribe(updatedTask => {
      this.tasks.update(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    });
  }


  deleteTask(taskId: number) {
  Swal.fire({
    title: 'האם אתם בטוחים?',
    text: "לא תוכלו לשחזר את המשימה לאחר המחיקה!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#6366f1', 
    cancelButtonColor: '#94a3b8',  
    confirmButtonText: 'כן, מחק!',
    cancelButtonText: 'ביטול',
    reverseButtons: true 
  }).then((result) => {
    if (result.isConfirmed) {
   
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          Swal.fire({
            title: 'נמחק!',
            text: 'המשימה הוסרה בהצלחה.',
            icon: 'success',
            confirmButtonColor: '#6366f1'
          });
          this.loadTasks(); 
        },
        error: () => {
          Swal.fire('שגיאה', 'לא הצלחנו למחוק את המשימה', 'error');
        }
      });
    }
  });
}
  activeTaskForComments: any = null;

  openComments(task: any) {
    this.activeTaskForComments = task;
  }

  closeComments() {
    this.activeTaskForComments = null;
  }
}


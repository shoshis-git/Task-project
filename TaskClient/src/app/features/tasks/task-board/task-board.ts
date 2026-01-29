import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../../core/services/task/task-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Tasks } from '../../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsComponent } from '../../comments/comments';
import Swal from 'sweetalert2';
import { TeamService } from '../../../core/services/team/team';
import { ServiceProject } from '../../../core/services/project/service-project';
import { AuthService } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-task-board',
  imports: [CommonModule, FormsModule, CommentsComponent],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
})
export class TaskBoard {
  private taskService = inject(TaskService);
  private projectService = inject(ServiceProject);
  private route = inject(ActivatedRoute);

  projectId = signal<number>(0);
  tasks = signal<Tasks[]>([]);

isLoading = signal(false);


  newTaskTitle = '';
  isListView: any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const pId = +params['projectId'];
      this.projectId.set(pId);

      this.loadTasks();


      this.loadProjectDetails(pId);
    });
  }

  loadProjectDetails(projectId: number) {
    this.isLoading.set(true);
    this.projectService.getProjects().subscribe( {
      next:(projects) => {
      const currentProject = projects.find(p => p.id === projectId);
      if (currentProject) {

        this.loadMembers(currentProject.team_id);
        this.isLoading.set(false);
      }
    }
    ,
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadMembers(teamId: number) {
    this.isLoading.set(true);
    this.teamService.getTeamMembers(teamId).subscribe( {
      next: (members) => {
        this.teamMembers.set(members);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadTasks() {
    this.isLoading.set(true); 
    this.taskService.getTasks(this.projectId()).subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: () => { this.isLoading.set(false); }
    });
  }
newTask = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  assignee_id: null,
  due_date: null
};
saveTask() {
  const taskData = {
    projectId: Number(this.projectId()),
    ...this.newTask
  };

  this.taskService.createTask(taskData).subscribe({
    next: (newTask) => {
      this.tasks.update(prev => [...prev, newTask]);
      this.closeAddTaskModal();
            Swal.fire({
        icon: 'success',
        title: 'משימה נוספה בהצלחה!',
        confirmButtonColor: 'linear-gradient(135deg, #6366f1, #a855f7)',
        timer: 2000
      });
    },
    error: () => {      
      Swal.fire({
        icon: 'error',
        title: 'פעולה נכשלה',
        text: 'נא להזין כותרת למשימה',
        confirmButtonColor: '#6366f1'
      })}
  });
}
isAddTaskModalOpen = false;

closeAddTaskModal() {
  this.isAddTaskModalOpen = false;
  this.resetNewTask();
}

resetNewTask() {
  this.newTask = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    assignee_id: null,
    due_date: null
  };
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



  teamMembers = signal<any[]>([]);

  private teamService = inject(TeamService);


  assignUser(taskId: number, userId: any) {

    const assignedId = userId ? Number(userId) : undefined;;

    this.taskService.updateTask(taskId, { assignee_id: assignedId }).subscribe({
      next: (updatedTask) => {

        this.tasks.update(prev => prev.map(t => t.id === taskId ? updatedTask : t));

        Swal.fire({
          icon: 'success',
          title: 'המשימה הוקצתה!',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
  onlyMyTasks = signal(false);
  private authService = inject(AuthService);
  filteredTasks = computed(() => {
    const all = this.tasks();
    if (this.onlyMyTasks()) {
      return all.filter(t => t.assignee_id === this.authService.currentUser()?.id);
    }
    return all;
  });



  filtered = computed(() => {
    const all = this.tasks();
    const currentUser = this.authService.currentUser();

    return this.onlyMyTasks()
      ? all.filter(t => t.assignee_id === currentUser?.id)
      : all;
  });

  todoTasks = computed(() => this.filtered().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.filtered().filter(t => t.status === 'in-progress'));
  doneTasks = computed(() => this.filtered().filter(t => t.status === 'done'));





  activeTaskForComments: any = null;



  openComments(task: any): void {
    this.activeTaskForComments = task;


    document.body.style.overflow = 'hidden';
  }

  closeComments(): void {
    this.activeTaskForComments = null;


    document.body.style.overflow = 'auto';
  }

  expandedTaskId: number | null = null;

  toggleComments(taskId: number) {

    this.expandedTaskId = this.expandedTaskId === taskId ? null : taskId;
  }

  onCommentAdded(task: any) {

    task.comments_count = (task.comments_count || 0) + 1;
  }







 

 


}
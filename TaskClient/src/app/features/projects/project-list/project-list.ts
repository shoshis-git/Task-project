import { Component, computed, inject, signal } from '@angular/core';
import { ServiceProject } from '../../../core/services/project/service-project';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Projects } from '../../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList {
  private projectService = inject(ServiceProject);
  private route = inject(ActivatedRoute);

  allProjects = signal<Projects[]>([]);
  teamId = signal<number>(0);
isLoading = signal(false);

  filteredProjects = computed(() =>
    this.allProjects().filter(p => p.team_id === this.teamId())
  );

  newProject = { name: '', description: '' };
  isModalOpen: any;

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.teamId.set(+params['teamId']);
      this.loadProjects();
    });
  }

  loadProjects() {
    this.isLoading.set(true);
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.allProjects.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }

    });
  }

  onCreateProject() {
    if (!this.newProject.name) return;

    const payload = {
      teamId: Number(this.teamId()),
      name: this.newProject.name,
      description: this.newProject.description
    };

    this.projectService.createProject(payload).subscribe({
      next: (project) => {
        Swal.fire({
          icon: 'success',
          title: 'הפרויקט נוסף בהצלחה!',
          confirmButtonColor: 'linear-gradient(135deg, #6366f1, #a855f7)',
          timer: 2000
        });
        this.allProjects.update(prev => [...prev, project]);
        this.newProject = { name: '', description: '' };
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'פעולה נכשלה',
          text: err.error?.error || 'שגיאה כללית ביצירת פרויקט',
          confirmButtonColor: '#6366f1'
        });
      }

    });
  }


  onDeleteProject(projectId: number) {
    Swal.fire({
      title: 'למחוק את הפרויקט?',
      text: "כל המשימות בתוך הפרויקט יימחקו לצמיתות!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'כן, מחק פרויקט'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(projectId).subscribe({
          next: () => {
            this.allProjects.update(prev => prev.filter(p => p.id !== projectId));
            Swal.fire('נמחק!', 'הפרויקט הוסר.', 'success');
          },
          error: (err) => {
            const msg = err.status === 403 ? 'רק חבר צוות מורשה למחוק פרויקטים' : 'שגיאה במחיקה';
            Swal.fire('אופס', msg, 'error');
          }
        });
      }
    });
  }


  onEditProject(project: Projects) {
    Swal.fire({
      title: 'עריכת פרויקט',
      html: `
      <input id="swal-name" class="swal2-input" placeholder="שם הפרויקט" value="${project.name}">
      <textarea id="swal-desc" class="swal2-textarea" placeholder="תיאור הפרויקט">${project.description || ''}</textarea>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'שמור שינויים',
      cancelButtonText: 'ביטול',
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value;
        const description = (document.getElementById('swal-desc') as HTMLTextAreaElement).value;

        if (!name) {
          Swal.showValidationMessage('חובה להזין שם לפרויקט');
        }
        return { name, description };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.updateProject(project.id, result.value).subscribe({
          next: (updatedProject) => {

            this.allProjects.update(prev =>
              prev.map(p => p.id === project.id ? updatedProject : p)
            );

            Swal.fire({
              icon: 'success',
              title: 'הפרויקט עודכן!',
              timer: 1500,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          },
          error: (err) => {
            const msg = err.status === 403 ? 'אין לך הרשאה לערוך פרויקט זה' : 'שגיאה בעדכון';
            Swal.fire('אופס', msg, 'error');
          }
        });
      }
    });
  }
}
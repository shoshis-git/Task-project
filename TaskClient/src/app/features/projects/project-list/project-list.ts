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
    this.projectService.getProjects().subscribe(data => {
      this.allProjects.set(data);
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
}

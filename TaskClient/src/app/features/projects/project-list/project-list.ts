import { Component, computed, inject, signal } from '@angular/core';
import { ServiceProject } from '../../../core/services/project/service-project';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Projects } from '../../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  
  // סיגנל מחושב שמסנן את הפרויקטים לפי הצוות הנוכחי
  filteredProjects = computed(() => 
    this.allProjects().filter(p => p.team_id === this.teamId())
  );

  newProject = { name: '', description: '' };

  ngOnInit() {
    // שליפת ה-teamId מהכתובת (למשל /teams/5/projects)
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
      team_id: this.teamId(),
      ...this.newProject
    };

    this.projectService.createProject(payload).subscribe({
      next: (project) => {
        this.allProjects.update(prev => [...prev, project]);
        this.newProject = { name: '', description: '' };
      }
    });
  }
}

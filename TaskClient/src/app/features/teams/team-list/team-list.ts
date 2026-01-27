import { Component, inject, signal } from '@angular/core';
import { TeamService } from '../../../core/services/team/team';
import { Teams } from '../../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
})
export class TeamList {
  private teamService = inject(TeamService);
  
  teams = signal<Teams[]>([]); // ניהול הרשימה בסיגנל
  newTeamName = '';

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getTeams().subscribe(data => {
      this.teams.set(data);
    });
  }

  onCreateTeam() {
    if (!this.newTeamName.trim()) return;

    this.teamService.createTeam(this.newTeamName).subscribe({
      next: (newTeam) => {
        this.teams.update(prev => [...prev, newTeam]); // עדכון הרשימה מיד
        this.newTeamName = '';
      },
      error: (err) => alert('שגיאה ביצירת צוות')
    });
  }
}

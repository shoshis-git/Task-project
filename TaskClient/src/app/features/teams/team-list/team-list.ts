import { Component, inject, signal } from '@angular/core';
import { TeamService } from '../../../core/services/team/team';
import { Teams } from '../../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-team-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
})
export class TeamList {
  private teamService = inject(TeamService);
  
  teams = signal<Teams[]>([]);
  newTeamName = '';
memberForm = {
    userId: null as number | null,
    role: 'member'
  };
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
  onAddMember(teamId: number) {
    if (!this.memberForm.userId) {
      alert('נא להזין ID של משתמש');
      return;
    }

    this.teamService.addMember(teamId, this.memberForm.userId, this.memberForm.role).subscribe({
      next: () => {
        alert('החבר נוסף בהצלחה!');
        this.memberForm.userId = null; 
        this.loadTeams(); 
      },
      error: (err) => alert('שגיאה בהוספת חבר: ' + (err.error?.error || 'שגיאה כללית'))
    });
  }
}

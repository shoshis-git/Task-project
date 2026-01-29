import { Component, inject, signal } from '@angular/core';
import { TeamService } from '../../../core/services/team/team';
import { Teams } from '../../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
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
   if (!this.newTeamName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'אופס...',
        text: 'נא להזין שם לצוות',
        confirmButtonColor: '#6366f1' // הצבע הסגול-כחול שלנו
      });
      return;
    }

    this.teamService.createTeam(this.newTeamName).subscribe({
      next: (newTeam) => {
        this.teams.update(prev => [...prev, newTeam]); // עדכון הרשימה מיד
        this.newTeamName = '';
        Swal.fire({
          icon: 'success',
          title: 'הצוות נוצר בהצלחה!',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-start'
        });
      },
      error: () =>{
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'לא הצלחנו ליצור את הצוות',
          confirmButtonColor: '#6366f1'
        });}
    });
  }
  onAddMember(teamId: number) {
if (!this.memberForm.userId) {
      Swal.fire({
        icon: 'info',
        text: 'נא להזין ID של משתמש',
        confirmButtonColor: '#6366f1'
      });
      return;
    }


    this.teamService.addMember(teamId, this.memberForm.userId, this.memberForm.role).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'חבר נוסף לצוות!',
          confirmButtonColor: 'linear-gradient(135deg, #6366f1, #a855f7)',
          timer: 2000
        });
        this.memberForm.userId = null; 
        this.loadTeams(); 
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'פעולה נכשלה',
          text: err.error?.error || 'שגיאה כללית בהוספת חבר',
          confirmButtonColor: '#6366f1'
        });}
    });
  }
}

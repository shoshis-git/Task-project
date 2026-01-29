import { Component, HostListener, inject, signal } from '@angular/core';
import { TeamService } from '../../../core/services/team/team';
import { Teams, User } from '../../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../core/services/user/user-service';
@Component({
  selector: 'app-team-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
})
export class TeamList {
  private teamService = inject(TeamService);
private userService = inject(UserService); // הזרקת השירות החדש
  
  allUsers = signal<User[]>([]); // סיגנל לרשימת כל המשתמשים
  showUsersList = signal(false);
  teams = signal<Teams[]>([]);
  newTeamName = '';
  memberForm = {
    userId: null as number | null,
    role: 'member'
  };
  ngOnInit() {
    this.loadTeams();
    this.loadAllUsers();
  }

  loadTeams() {
    this.teamService.getTeams().subscribe(data => {
      this.teams.set(data);
    });
  }
loadAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.allUsers.set(data);
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
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'לא הצלחנו ליצור את הצוות',
          confirmButtonColor: '#6366f1'
        });
      }
    });
  }
  selectUserForAdd(userId: number) {
    this.memberForm.userId = userId;
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: `ה-ID ${userId} הועתק לטופס`,
      showConfirmButton: false,
      timer: 1500
    });
  }
  onAddMember(teamId: number) {
  if (!this.memberForm.userId) {
    Swal.fire('מידע חסר', 'יש להזין מזהה משתמש (ID)', 'info');
    return;
  }

  this.teamService.addMember(teamId, this.memberForm.userId, this.memberForm.role).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'החבר נוסף!',
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false
      });
      this.memberForm.userId = null; // איפוס השדה
      this.loadTeams(); // רענון כדי לעדכן את ה-members_count
    },
    error: (err) => {
      // טיפול ספציפי לשגיאות של השרת שלך
      let errorMsg = 'שגיאה בהוספת חבר';
      
      if (err.status === 403) {
        errorMsg = 'אין לך הרשאה להוסיף חברים לצוות זה.';
      } else if (err.status === 400) {
        errorMsg = 'נתוני המשתמש אינם תקינים.';
      }

      Swal.fire({
        icon: 'error',
        title: 'הפעולה נכשלה',
        text: errorMsg,
        confirmButtonColor: '#6366f1'
      });
    }
  });
}


  onDeleteTeam(teamId: number) {
  Swal.fire({
    title: 'מחיקת צוות',
    text: "האם את בטוחה? פעולה זו תמחוק את הצוות וכל הפרויקטים המשויכים אליו.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444', // אדום TaskFlow
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'כן, מחק צוות',
    cancelButtonText: 'ביטול'
  }).then((result) => {
    if (result.isConfirmed) {
      this.teamService.deleteTeam(teamId).subscribe({
        next: () => {
          // עדכון ה-Signal המקומי כדי שהצוות ייעלם מהמסך מיד
          this.teams.update(prev => prev.filter(t => t.id !== teamId));
          
          Swal.fire({
            icon: 'success',
            title: 'נמחק!',
            text: 'הצוות הוסר בהצלחה.',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err) => {
          if (err.status === 403) {
            Swal.fire({
              icon: 'error',
              title: 'אין הרשאה',
              text: 'רק בעל הצוות (Owner) מוסמך למחוק אותו.',
              confirmButtonColor: '#6366f1'
            });
          } else {
            Swal.fire('שגיאה', 'לא ניתן למחוק את הצוות כרגע.', 'error');
          }
        }
      });
    }
  });
}




onRemoveMember(teamId: number, userId: number, userName: string) {
  Swal.fire({
    title: 'הסרת חבר צוות',
    text: `האם את בטוחה שברצונך להסיר את ${userName} מהצוות?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444', // אדום למחיקה
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'כן, הסר מהצוות',
    cancelButtonText: 'ביטול'
  }).then((result) => {
    if (result.isConfirmed) {
      this.teamService.removeMember(teamId, userId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'החבר הוסר',
            text: `${userName} כבר לא חלק מהצוות.`,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          this.loadTeams(); // רענון הרשימה כדי לעדכן את כמות החברים
        },
        error: (err) => {
          if (err.status === 403) {
            Swal.fire('אין הרשאה', 'רק מנהל הצוות יכול להסיר חברים.', 'error');
          } else {
            Swal.fire('שגיאה', 'לא ניתן היה להסיר את החבר כרגע.', 'error');
          }
        }
      });
    }
  });
}
members = signal<any[]>([]);
onGetTeamMembers(teamId: number) {
this.teamService.getTeamMembers(teamId).subscribe({
    next: (members) => {
      // 2. בניית רשימת ה-HTML להצגה בתוך ה-Modal
      const membersHtml = members.map(m => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
          <span style="font-weight: 500;">${m.name} (ID: ${m.id})</span>
          <button 
            onclick="window.dispatchEvent(new CustomEvent('removeMember', {detail: {teamId: ${teamId}, userId: ${m.id}, name: '${m.name}'}}))"
            style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
            הסר
          </button>
        </div>
      `).join('') || '<p>אין חברים נוספים בצוות</p>';

      // 3. הצגת ה-Modal
      Swal.fire({
        title: 'חברי צוות',
        html: `<div style="text-align: right;">${membersHtml}</div>`,
        showConfirmButton: false,
        showCloseButton: true
      });
    },
    error: () => Swal.fire('שגיאה', 'לא ניתן היה לטעון את רשימת החברים', 'error')
  });
  
}

// 4. האזנה לאירוע המחיקה מה-Modal (כי Swal משתמש ב-HTML גולמי)
@HostListener('window:removeMember', ['$event'])
onRemoveMemberFromEvent(event: any) {
  const { teamId, userId, name } = event.detail;
  Swal.close(); // סגירת המודל של הרשימה
  this.onRemoveMember(teamId, userId, name);
}
}
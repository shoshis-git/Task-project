import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login/login';
import { AuthGuard } from './core/guards/auth-guard';
import { TeamList } from './features/teams/team-list/team-list';
import { Register } from './features/auth/login/register/register/register';
import { ProjectList } from './features/projects/project-list/project-list';
import { TaskBoard } from './features/tasks/task-board/task-board';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {path:'login',component:Login},
    {path:'register',component:Register},
    {path:'teams',component:TeamList, canActivate:[AuthGuard]},
    { path: 'teams/:teamId/projects',  component: ProjectList, canActivate: [AuthGuard]},
    { path: 'tasks/:projectId',   component: TaskBoard,    canActivate: [AuthGuard] },
     { path: '', redirectTo: 'teams', pathMatch: 'full' },
    { path: '**', redirectTo: 'teams' }
  
 
]





 




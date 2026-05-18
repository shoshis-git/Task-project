# Task Flow

A collaborative team project and task management application designed for teams to organize, track, and manage their work effectively.

## 📋 What You Can Do

### Teams
- Create and manage multiple teams
- Invite team members and assign roles
- Organize projects within teams

### Projects
- Create projects within teams
- Set project descriptions and details
- Organize tasks by project
- Manage team collaboration on specific initiatives

### Tasks
- Create and manage tasks within projects
- Track task progress with status updates
- Assign tasks to team members
- View all tasks in an interactive task board
- Update and delete tasks as needed

### Comments & Collaboration
- Add comments to tasks for team discussion
- Real-time collaboration feedback
- Keep all task-related conversations in one place

### User Management
- Secure authentication with login and registration
- User profiles and team membership
- Role-based access control

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- A modern web browser

### Quick Setup

#### 1. Backend Setup (WolfTasksServer)
```bash
cd WolfTasksServer
npm install
npm run seed        # (optional) Load demo data
npm start
```
The API will be available at `http://localhost:3000`

#### 2. Frontend Setup (TaskClient)
```bash
cd TaskClient
npm install
ng serve
```
Open your browser to `http://localhost:4200`

### Default Credentials
Check the seeded data in `WolfTasksServer/seed.js` for demo user credentials.

## 📂 Project Structure

```
TaskClient/          - Angular frontend application
├── src/
│   └── app/
│       ├── features/       - Main feature modules (teams, projects, tasks, comments, auth)
│       ├── core/           - Core services (authentication, API, interceptors)
│       └── shared/         - Shared utilities and directives

WolfTasksServer/     - Node.js/Express backend API
├── src/
│   ├── routes/      - API endpoints
│   ├── controllers/ - Business logic
│   ├── middleware/  - Authentication & request handling
│   └── db.js        - Database setup
```

## 🔐 Authentication

The application uses secure JWT token-based authentication:
- Register a new account or log in with existing credentials
- Your authentication token is automatically managed
- All API requests are secured and validated

## 💾 Database

The backend uses SQLite for data persistence with support for:
- Local development with file-based database
- Cloud deployment with persistent storage on Render



## 📝 Features by Module

| Module | What It Does |
|--------|------------|
| **Auth** | User registration, login, and session management |
| **Teams** | Create teams, manage members and roles |
| **Projects** | Organize work into projects within teams |
| **Tasks** | Create tasks, track progress, assign to members |
| **Comments** | Collaborate with inline task comments |
| **User** | Manage user profiles and team memberships |

## 🤝 Contributing

See individual module READMEs in `TaskClient/` and `WolfTasksServer/` for development guidelines.

## 📞 Support

For API reference and endpoint documentation, see the docs folder in WolfTasksServer.

---

**Wolf Tasks** — Where teams collaborate, projects get organized, and tasks get done.

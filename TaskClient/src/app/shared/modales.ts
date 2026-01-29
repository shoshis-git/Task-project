export interface User{
    id: number;
    name: string;
    email: string;
    role: string;
}
export interface Teams{
    id: number;
    name: string;
    created_at: Date;
    members_count: number;

}
export interface Projects{
    id: number;
    team_id: number;
    name: string;
    description: string;
    statues:'todo' | 'in-progress' | 'done';
    created_at: Date;
}
export interface Tasks{
comments_count: any;
    id: number;
    project_id: number;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    assignee_id: number;
    due_date: Date;
    order_index: number;
    created_at: Date;
    updated_at: Date;
}
export interface Comments{
    id: number;
    task_id: number;
    user_id: number;
    body: string;
    created_at: Date;
    author_name: string;
}
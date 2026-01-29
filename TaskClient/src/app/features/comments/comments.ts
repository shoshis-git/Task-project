import { Component, inject, input, signal } from '@angular/core';
import { CommentService } from '../../core/services/comment/comment-service';
import { Comments } from '../../shared/modales';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task/task-service';
import { TaskBoard } from '../tasks/task-board/task-board';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class CommentsComponent {
  private commentService = inject(CommentService);
  private taskService = inject(TaskBoard)
isLoading = signal(false);
  taskId = input.required<number>();
  comments = signal<Comments[]>([]);
  newCommentBody = signal('');

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.isLoading.set(true);
    this.commentService.getComments(this.taskId()).subscribe( {
      next:(data) => {
        this.comments.set(data);
      this.isLoading.set(false);
      }
      ,
      error: () => {
        this.isLoading.set(false);
        
      }
    });
  }

  sendComment() {

    if (!this.newCommentBody().trim()) return;

    this.commentService.addComment({
      taskId: Number(this.taskId()),
      body: this.newCommentBody()
    }).subscribe(newComment => {
      this.comments.update(prev => [...prev, newComment]);
      this.newCommentBody.set('');
    });
  }


  closeComments(): void {

    this.taskService.closeComments()


  }
}

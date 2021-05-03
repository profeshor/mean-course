import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  posts : Post [] = []
  private postSubcription : Subscription;

  constructor(public postService: PostService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSubcription = this.postService.getPostUpdatedListener()
      .subscribe(
        (posts: Post[]) => {
          this.posts = posts;
          this.isLoading = false;
        }
      );
  }

  onDelete(postId: string) {
    console.log("postId", postId);
    this.postService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postSubcription.unsubscribe();
  }
}

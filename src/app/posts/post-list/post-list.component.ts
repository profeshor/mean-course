import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  isLoading = false;
  isUserAuthenticated = false;
  totalPosts = 0;
  postPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10]
  posts : Post [] = []
  userId: string;
  private postSubcription : Subscription;
  private authListenerSubs : Subscription;

  constructor(public postService: PostService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, 1);
    this.userId = this.authService.getUserId();
    this.postSubcription = this.postService.getPostUpdatedListener()
      .subscribe(
        (postsData: {posts: Post[], postCount: number}) => {
          this.posts = postsData.posts;
          this.totalPosts = postsData.postCount;
          this.isLoading = false;
        }
      );
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated;
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postSubcription.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }
}

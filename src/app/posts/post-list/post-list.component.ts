import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
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
  totalPosts = 0;
  postPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10]
  posts : Post [] = []
  private postSubcription : Subscription;

  constructor(public postService: PostService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postPerPage, 1);
    this.postSubcription = this.postService.getPostUpdatedListener()
      .subscribe(
        (postsData: {posts: Post[], postCount: number}) => {
          this.posts = postsData.posts;
          this.totalPosts = postsData.postCount;
          this.isLoading = false;
        }
      );
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postSubcription.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }
}

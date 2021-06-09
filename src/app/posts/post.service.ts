import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { Post } from './post';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  private posts:Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>()

  constructor(private httpClient:HttpClient, private router: Router) { }

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postPerPage}&page=${currentPage}`;
    this.httpClient.get<{posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(
      map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          maxPosts: postData.maxPosts
        };
      })
    )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPost(id:string) {
    return this.httpClient.get<{_id: string, title: string, content: string, imagePath: string}>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title)
    this.httpClient.post<{post:Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      })
  }

  updatePost (id:string, title: string, content: string, image: File | string) {
    let postData : Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        title: title,
        content: content,
        id: id,
        imagePath: image
      };
    }

    this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      })
  }

  deletePost(postId:string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + postId);
  }
}

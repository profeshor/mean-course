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
  private postsUpdated = new Subject<Post[]>()

  constructor(private httpClient:HttpClient, private router: Router) { }

  getPosts() {
    this.httpClient.get<{posts: any}>('http://localhost:3000/api/posts')
      .pipe(map( (postData) => {
        return postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
          };
        })
      }))
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id:string) {
    return this.httpClient.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content
    };
    this.httpClient.post<any>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        console.log(response);
        post.id=response.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  updatePost (postId:string, title: string, content: string) {
    const post : Post = {
      title: title,
      content: content,
      id: postId
    };
    this.httpClient.put('http://localhost:3000/api/posts/' + postId, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === postId);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  deletePost(postId:string) {
    this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe((response) => {
        console.log(response);
        const updatedPosts = this.posts.filter(post =>
          post.id !== postId
        );
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';  
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[];
  curPost: Post = {
    id: 0,
    title: '',
    body: ''
  };
  isEdit: boolean = false;;

  constructor(private postService : PostService) { }

  ngOnInit(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    })
  }

  onNewPost(post: Post) {
    console.log(post);
    this.posts.unshift(post);
  }

  editPost(post: Post) {
    this.curPost = post;
    this.isEdit = true;
  }

  onUpdatedPost(post: Post) {
    this.posts.forEach((cur, index) => {
      if(post.id == cur.id) {
        this.posts.splice(index, 1);
        this.posts.unshift(post);
        this.isEdit = false;
        this.curPost = {
          id: 0,
          title: '',
          body: ''
        };
      }
    })
  }

}

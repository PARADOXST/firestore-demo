import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';  

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  
  post: Post;
  @Output() newPost: EventEmitter<Post> = new EventEmitter();
  @Output() updatedPost: EventEmitter<Post> = new EventEmitter();

  @Input() curPost: Post;
  @Input() isEdit: boolean;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  addPost(title: string, body: string) {
    if(!title || !body) {
      alert('Wrong');
    } else {
      console.log(title, body);
      this.postService.savePost({title, body} as Post).subscribe(
        post => {
          this.newPost.emit(post);
          console.log(post);
        }
      )
    }
  }

  updatePost() {
    this.postService.updatePost(this.curPost).subscribe(post => {
      console.log(post);
      this.isEdit = false;
      this.updatedPost.emit(post);
    })
  }
}

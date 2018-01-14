import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Post } from './post'; 

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  constructor(private blogService: BlogService) { }

  posts: Post[];

  getPosts(): void {
    this.blogService.getPosts()
      .subscribe(posts => this.posts = posts);
  }

  ngOnInit() {
    this.getPosts();
  }

}

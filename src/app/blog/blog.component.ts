import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Post } from './post'; 

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  constructor() { }

  posts: Post[] = [{
    title: "A post",
    date: new Date(),
    body: "Some Body",
    tags: ["general", "okay"]
  }];

  //posts: Post[];

  ngOnInit() {
  }

}

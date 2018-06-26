import { switchMap } from 'rxjs/operators';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BlogService } from './blog.service';
import { Post } from './post';

@Component({
  selector: 'app-blog-post',
  templateUrl: './post.component.html'
})
export class BlogPostComponent implements OnInit {
  post: Post;
  body: String;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
        switchMap((params: Params) => {
          return this.blogService.get(params.id)
        }
      ))
      .subscribe(post => {
        this.post = post;
      });
  }
}

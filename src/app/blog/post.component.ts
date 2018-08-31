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

    /*
    var disqus_config = function () {
      this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
      this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */

    var d = document, s = d.createElement('script');
    s.src = 'https://alanbuttars.disqus.com/embed.js';
    s.setAttribute('data-timestamp', new Date().toString());
    (d.head || d.body).appendChild(s);
  }
}

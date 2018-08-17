import { Component, OnInit }      from '@angular/core';

import { BlogService } from './../blog/blog.service';
import { Post } from './../blog/post';

declare var $: any;
declare var ga: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html'
})
export class BlogComponent implements OnInit {
  recentPosts: Post[];
  featuredPosts: Post[];

  constructor(
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.blogService.getRecentPosts()
      .then(posts => {
        this.recentPosts = posts;
      });

    this.blogService.getFeaturedPosts()
      .then(posts => {
        this.featuredPosts = posts;
      });
  }

  ngAfterViewInit() {
    $(".ui.sticky.blog.navigation").sticky({
      context: "#blog",
      //observeChanges: true
    });
  }

  onRouteChange(): void {
    if (location.pathname != "/blog") {
      ga('create', 'UA-52727032-1', 'auto');
      ga('send', 'pageview', location.pathname);
    }
  }
}

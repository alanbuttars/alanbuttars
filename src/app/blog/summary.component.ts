import { Component, OnInit }      from '@angular/core';

import { ProjectService } from './../projects/project.service';
import { Project } from './../projects/project';

import { BlogService } from './../blog/blog.service';
import { Post } from './../blog/post';

@Component({
  selector: 'app-blog-summary',
  templateUrl: './summary.component.html'
})
export class BlogSummaryComponent implements OnInit {
  posts: Post[];
  projects: Project[];

  constructor(
    private blogService: BlogService,
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.blogService.getPostsWithoutSeries()
      .then(posts => {
        this.posts = posts;
      });

    this.projectService.getSeries()
      .then(projects => {
        this.projects = projects;
        this.projects.forEach((project) => {
          this.blogService.getPostsByIds(project.postIds)
            .then(posts => {
              project.posts = posts;
            });
        });
      });
  }
}

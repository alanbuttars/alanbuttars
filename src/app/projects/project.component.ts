import { switchMap } from 'rxjs/operators';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ProjectService } from './project.service';
import { Project } from './project';
import { Icon } from './../icon';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {
  project: Project;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
        switchMap((params: Params) => {
          return this.projectService.get(params.id)
        })
      )
      .subscribe(project => {
        this.project = project
      });
  }
}

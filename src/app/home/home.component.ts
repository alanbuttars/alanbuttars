import { Component, OnInit }      from '@angular/core';

import { ProjectService } from './../projects/project.service';
import { Project } from './../projects/project';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  projects: Project[];

  constructor(
    private projectService: ProjectService,
  ) { }

  ngOnInit(): void {
    this.projectService.getAll()
      .then(projects => {
        this.projects = projects;
      });
  }
}

import { Injectable } from '@angular/core';
import { Icon } from './../icon';
import { Project } from './project';

export const PROJECTS = [
  {
    id: "commons",
    title: "Commons",
    subtitle: "Reusable Java libraries",
    description: "Commons is a collection of Java libraries which encompass popular web application tasks. Among them are modules for deploying command line processes, compressing and decompressing files, and responding to configuration file updates during application runtime.",
    role: "Creator",
    smallImage: "assets/images/commons-small.png",
    mediumImage: "assets/images/commons.png",
    largeImage: "assets/images/commons-large.png",
    squareImage: "assets/images/commons-square.png",
    startYear: "2017",
    endYear: null,
    url: "https://alanbuttars.github.io/commons-java-docs",
    icons: [
      {
        url: "https://github.com/alanbuttars/commons-java",
        icon: "github",
      },
    ],
    skills: [
      "Java",
    ],
    postIds: [],
  },
  {
    id: "openqollo",
    title: "OpenQollo",
    subtitle: "A PhoneGap tutorial",
    description: "OpenQollo is a full-featured image-sharing application using PhoneGap's cross-platform mobile application framework. The application was developed as an 8-week tutorial going over features of a typical mobile app, including login, registration, and token authentication.",
    role: "Owner",
    smallImage: "assets/images/openqollo-small.png",
    mediumImage: "assets/images/openqollo.png",
    largeImage: "assets/images/openqollo-large.png",
    squareImage: "assets/images/openqollo-square.png",
    startYear: "Dec 2014",
    endYear: "May 2015",
    url: null,
    icons: [
      {
        url: "https://github.com/alanbuttars/openqollo",
        icon: "github",
      },
    ],
    skills: [
      "PhoneGap", "Cordova", "PHP",
    ],
    postIds: ["2", "3", "4", "5", "6", "7", "8"],
  },
  {
    id: "efp",
    title: "Education For Purpose",
    subtitle: "Access to high quality education should not be limited by ZIP code.",
    description: "Education For Purpose is a non-profit organization based in Omaha, Nebraska, dedicated to solving education inequality in the US. I designed the website and implemented admin functionality to maintain user records.",
    role: "Webmaster",
    smallImage: "assets/images/efp-small.png",
    mediumImage: "assets/images/efp.png",
    largeImage: "assets/images/efp-large.png",
    squareImage: "assets/images/efp-square.png",
    startYear: "2014",
    endYear: "2015",
    url: "https://www.educationforpurpose.org",
    icons: [
      {
        url: "https://twitter.com/Edu4Purpose",
        icon: "twitter",
      },
    ],
    skills: [
      "PHP", "AngularJS",
    ],
    postIds: [],
  },
];

@Injectable()
export class ProjectService {

  get(id: string): Promise<Project> {
    return Promise.resolve(PROJECTS.find(project => project.id == id));
  }

  getAll(): Promise<Project[]> {
    return Promise.resolve(PROJECTS);
  }

  getSeries(): Promise<Project[]> {
    return Promise.resolve(PROJECTS.filter(project => project.postIds.length > 0));
  }
}

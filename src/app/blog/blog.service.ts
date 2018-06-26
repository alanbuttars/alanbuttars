import { Injectable } from '@angular/core';
import { Post } from './post';

export const POSTS = [
  {
    id: "1",
    title: "Ruzzle Breaker",
    description: "At its core, programming is about two things: (1) solving problems too precise or time-consuming for a human, and (2) using those solutions to make your friends think you're more clever than you actually are. Check out an example of both in this post as I show you how to beat Boggle™ and its popular mobile counterpart, Ruzzle™",
    smallImage: "assets/images/ruzzle-small.png",
    largeImage: "assets/images/ruzzle-large.png",
    squareImage: "assets/images/ruzzle-square.png",
    date: "11/10/2014",
    project: null,
  },

  {
    id: "2",
    title: "PhoneGap Part 1: OpenQollo's Login and Register",
    description: "PhoneGap is making a name for itself as a cross-platform mobile framework. Why not see what all the hype is about? Over the next several weeks, I'll take you through an end-to-end, open-source image-sharing application. Let's start with the basics of any application: login and registration.",
    smallImage: "assets/images/openqollo-small.png",
    largeImage: "assets/images/openqollo-large.png",
    squareImage: "assets/images/openqollo-square.png",
    date: "12/30/2014",
    project: "openqollo",
  },

  {
    id: "3",
    title: "PhoneGap Part 2: Authenticating REST calls",
    description: "Last week, I walked you through an introduction to OpenQollo, an open-source mobile application using the PhoneGap framework. In my last post, I took you through OpenQollo's registration and login logic. Today, I'll cover how to authenticate REST calls using the HTML5 web storage API.",
    smallImage: "assets/images/openqollo-small.png",
    largeImage: "assets/images/openqollo-large.png",
    squareImage: "assets/images/openqollo-square.png",
    date: "1/3/2015",
    project: "openqollo",
  },

  {
    id: "4",
    title: "PhoneGap Part 3: Angular UI Router",
    description: "In the previous two OpenQollo posts, I walked you through safely storing passwords with PHP and MySQL and authenticating REST calls with client-side code. Those two posts were a bit heavy on the server side. Let's get into some in-depth client code, shall we? In this week's post, I'll introduce you to Angular JS's sister project, Angular UI Router.",
    smallImage: "assets/images/openqollo-small.png",
    largeImage: "assets/images/openqollo-large.png",
    squareImage: "assets/images/openqollo-square.png",
    date: "1/5/2015",
    project: "openqollo",
  },

  {
    id: "5",
    title: "PhoneGap Part 4: Reading contact lists and using the Web SQL database",
    description: "PhoneGap provides plugins for, among other common tasks, reading a phone's contact list and generating client-side SQLite databases.",
    smallImage: "assets/images/openqollo-small.png",
    largeImage: "assets/images/openqollo-large.png",
    squareImage: "assets/images/openqollo-square.png",
    date: "1/21/2015",
    project: "openqollo",
  },

  {
    id: "6",
    title: "PhoneGap Part 5: MVC with Angular JS",
    description: "Learn how to use Angular's controllers, services, and data-binding to make beautifully simple MVC apps.",
    smallImage: "assets/images/openqollo-small.png",
    largeImage: "assets/images/openqollo-large.png",
    squareImage: "assets/images/openqollo-square.png",
    date: "3/22/2015",
    project: "openqollo",
  },

  {
    id: "7",
    title: "PhoneGap Part 6: Using the Cordova camera and file transfer plugins",
    description: "Cordova comes with a plethora of platform-independent plugins to help you tap into your mobile device. In today's lesson, I'll walk you through two which go hand-in-hand.",
    smallImage: "assets/images/openqollo-small.png",
    largeImage: "assets/images/openqollo-large.png",
    squareImage: "assets/images/openqollo-square.png",
    date: "4/11/2015",
    project: "openqollo",
  },

  {
    id: "8",
    title: "PhoneGap Part 7: Downloading with the file transfer plugin",
    description: "In the final installment of the OpenQollo tutorial, I'll walk you through using the Cordova file transfer plugin to download files from a remote server.",
    smallImage: "assets/images/openqollo-small.png",
    largeImage: "assets/images/openqollo-large.png",
    squareImage: "assets/images/openqollo-square.png",
    date: "5/5/2015",
    project: "openqollo",
  },
];

@Injectable()
export class BlogService {

  get(id: string): Promise<Post> {
    return Promise.resolve(POSTS.find(post => post.id == id));
  }

  getPostsWithoutSeries(): Promise<Post[]> {
    return Promise.resolve(POSTS.filter(post => post.project == undefined));
  }

  getRecentPosts(): Promise<Post[]> {
    return Promise.resolve(POSTS.slice().reverse().slice(0, 3));
  }

  getFeaturedPosts(): Promise<Post[]> {
    return this.getPostsByIds(["1", "4"])
  }

  getPostsByIds(postIds: string[]): Promise<Post[]> {
    return Promise.resolve(POSTS.filter(post => postIds.includes(post.id)));
  }
}

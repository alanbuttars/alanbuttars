import { Icon } from './../icon';
import { BlogService } from './../blog/blog.service';
import { Post } from './../blog/post';

export class Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  role: string;
  mediumImage: string;
  largeImage: string;
  squareImage: string;
  startYear: string;
  endYear?: string;
  url: string;
  skills: string[];
  icons: Icon[];
  postIds?: string[];
  posts?: Post[];
}

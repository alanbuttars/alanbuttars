import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent }   from './home/home.component';
import { BlogComponent }   from './blog/blog.component';
import { BlogPostComponent }   from './blog/post.component';
import { BlogSummaryComponent }   from './blog/summary.component';
import { ContactComponent }   from './contact/contact.component';

const routes: Routes = [
  { path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  { path: 'home',
    component: HomeComponent
  },
  { path: 'blog',
    component: BlogComponent,
    children: [
      { path: '',
        component: BlogSummaryComponent,
      },
      { path: ':id',
        component: BlogPostComponent,
      }
    ],
  },
  { path: 'contact',
    component: ContactComponent
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

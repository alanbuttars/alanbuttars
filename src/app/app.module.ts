import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { NguiStickyModule } from '@ngui/sticky';
import { HighlightModule } from 'ngx-highlightjs';
import { ScrollToModule } from 'ng2-scroll-to';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { BlogPostComponent } from './blog/post.component';
import { BlogSummaryComponent } from './blog/summary.component';

import { BlogPost1Component } from './blog/posts/post1.component';
import { BlogPost2Component } from './blog/posts/post2.component';
import { BlogPost3Component } from './blog/posts/post3.component';
import { BlogPost4Component } from './blog/posts/post4.component';
import { BlogPost5Component } from './blog/posts/post5.component';
import { BlogPost6Component } from './blog/posts/post6.component';
import { BlogPost7Component } from './blog/posts/post7.component';
import { BlogPost8Component } from './blog/posts/post8.component';
import { ContactComponent } from './contact/contact.component';

import { BlogService }   from './blog/blog.service';
import { ProjectService }   from './projects/project.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    BlogComponent,
    BlogPostComponent,
    BlogPost1Component,
    BlogPost2Component,
    BlogPost3Component,
    BlogPost4Component,
    BlogPost5Component,
    BlogPost6Component,
    BlogPost7Component,
    BlogPost8Component,
    BlogSummaryComponent,
    ContactComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    SuiModule,
    NguiStickyModule,
    HighlightModule.forRoot({theme: 'googlecode'}),
    ScrollToModule.forRoot(),
  ],
  providers: [
    BlogService,
    ProjectService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

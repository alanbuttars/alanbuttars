import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HighlightModule } from 'ngx-highlightjs';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NguiStickyModule } from '@ngui/sticky';
import { ScrollToModule } from 'ng2-scroll-to';
import { SuiModule } from 'ng2-semantic-ui';

import { AppComponent } from './app.component';
import { BlogComponent } from './blog/blog.component';
import { BlogPostComponent } from './blog/post.component';
import { BlogPost1Component } from './blog/posts/post1.component';
import { BlogPost2Component } from './blog/posts/post2.component';
import { BlogPost3Component } from './blog/posts/post3.component';
import { BlogPost4Component } from './blog/posts/post4.component';
import { BlogPost5Component } from './blog/posts/post5.component';
import { BlogPost6Component } from './blog/posts/post6.component';
import { BlogPost7Component } from './blog/posts/post7.component';
import { BlogPost8Component } from './blog/posts/post8.component';
import { BlogPost9Component } from './blog/posts/post9.component';
import { BlogSummaryComponent } from './blog/summary.component';
import { ContactComponent } from './contact/contact.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './projects/project.component';

import { BlogService }   from './blog/blog.service';
import { LambdaService }   from './lambda/lambda.service';
import { ProjectService }   from './projects/project.service';

@NgModule({
  declarations: [
    AppComponent,
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
    BlogPost9Component,
    BlogSummaryComponent,
    ContactComponent,
    HeaderComponent,
    HomeComponent,
    ProjectComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HighlightModule.forRoot({theme: 'googlecode'}),
    HttpClientModule,
    NguiStickyModule,
    ScrollToModule.forRoot(),
    SuiModule,
  ],
  providers: [
    BlogService,
    LambdaService,
    ProjectService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

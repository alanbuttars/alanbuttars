import { Component } from '@angular/core';

declare var $: any;
declare var ga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  formattedYear = 2013 == new Date().getFullYear() ? 2013 : 2013 + "-" + new Date().getFullYear();

  onRouteChange(): void {
    ga('create', 'UA-52727032-1', 'auto');
    ga('send', 'pageview', location.pathname);
  }
}

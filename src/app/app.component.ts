import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  formattedYear = 2013 == new Date().getFullYear() ? 2013 : 2013 + "-" + new Date().getFullYear();
}

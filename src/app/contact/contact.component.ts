import { Component }      from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  constructor(
  ) { }

  ngAfterViewInit() {
    console.log("TRYING");
    console.log($(".ui.sticky.page.navigation"));
    console.log($(".ui.sticky.blog.navigation"));

    $(".ui.sticky").sticky({
    context: "#blog",
    });
  }
}

import { Component }      from '@angular/core';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  
  model = {};
  state = null;
  errorMessage = null;

  constructor(
    private contactService: ContactService
  ) { }

  onSubmit() {
    this.state = 'loading';
    this.errorMessage = null;

    this.contactService.send(this.model)
      .subscribe(
        (data: any) => {
         this.state = 'success';
        },
        error => {
          this.state = 'error';
          this.errorMessage = error;
        }
    );
  }
}

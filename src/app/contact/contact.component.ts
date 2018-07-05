import { Component }      from '@angular/core';
import { LambdaService } from './../lambda/lambda.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  
  model = {
    name: null,
    email: null,
    comments: null,
  };
  state = null;
  errorMessage = null;
  result = {};

  constructor(
    private lambdaService: LambdaService
  ) { }

  onSubmit() {
    this.state = 'loading';
    this.errorMessage = null;
    this.result = {};

    this.lambdaService.contact(this.model)
      .subscribe(
        (data: any) => {
         this.state = 'success';
         this.result = data;
        },
        error => {
          this.state = 'error';
          this.errorMessage = error;
        }
    );
  }
}

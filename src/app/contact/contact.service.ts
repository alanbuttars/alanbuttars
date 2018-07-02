import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ContactService {
  constructor(private http: HttpClient) {}

  send(model: any): Observable<{}> {
    return this.http.post<{}>("https://example.com", model)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log("Error: ", error.error.message);
    }
    else {
      console.log("Error: ", error.status, error.error);
    }

    return throwError("An error occurred");
  }
}

import { Injectable } from '@angular/core';
import { Constants } from "../constants/constants";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FormEndpointsService {

  constructor(private http: HttpClient) { }

  httpHeaders = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || 'N/A'
  });

  getFormData(): Observable<any> {
    return this.http.get<any>(`${Constants.apiPaths.get_form_data}`, {headers: this.httpHeaders}).pipe(
      map((data: any) => data),
      catchError(this.handleError)
    );
  }

  // Handle errors
  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occurred: ${err.error.message}`;
    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    return throwError(err.error);
  }
}

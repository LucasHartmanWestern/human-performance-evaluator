import { Injectable } from '@angular/core';
import { Constants } from "../constants/constants";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";
import { GameEntry } from "../constants/common.enum"

@Injectable({
  providedIn: 'root'
})
export class GameEndpointsService {

  constructor(private http: HttpClient) { }

  httpHeaders = new HttpHeaders({
    'Authorization': localStorage.getItem('token') || 'N/A'
  });

  userInfo: any = JSON.parse(localStorage.getItem('userInfo') || '{}');

  getFirstImage(): Observable<any> {
    return this.http.get<GameEntry>(`${Constants.apiPaths.game}/begin`, {headers: this.httpHeaders}).pipe(
      map((data: GameEntry) => data),
      catchError(this.handleError)
    );
  }

  submitImage(time: number, numOfErrors: number): Observable<any> {
    return this.http.post<GameEntry>(`${Constants.apiPaths.game}/next`, {time: time, numOfErrors: numOfErrors, userInfo: this.userInfo}, {headers: this.httpHeaders}).pipe(
      map((data: GameEntry) => data),
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

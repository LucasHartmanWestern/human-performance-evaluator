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

  getFirstImage(): Observable<any> {
    return this.http.get<GameEntry>(`${Constants.apiPaths.game}-begin`, {headers: this.httpHeaders}).pipe(
      map((data: GameEntry) => data),
      catchError(this.handleError)
    );
  }

  submitImage(time: number, numOfErrors: number, imageIndex: number, distOffset?: number, xCoord?: number, yCoord?: number): Observable<any> {
    let userID: any = localStorage.getItem('userID');
    if (!userID) {
     console.log("NO USER ID");
    }
    return this.http.post<GameEntry>(`${Constants.apiPaths.game}-next`, {
      time: time,
      numOfErrors: numOfErrors,
      'user-ID': userID,
      'user-index': imageIndex,
      'dist-offset': distOffset,
      'xCoord': xCoord,
      'yCoord': yCoord
    }, {headers: this.httpHeaders}).pipe(
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

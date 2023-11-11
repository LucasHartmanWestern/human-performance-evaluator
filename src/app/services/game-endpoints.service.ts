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

  submitImage(time: number, numOfErrors: number, imageIndex: number, task_type?: string, distOffset?: number, xCoord?: number, yCoord?: number, present?: boolean, xOffset?: number, yOffset?: number, targetPostX?: number, targetPosY?: number, extra?: any): Observable<any> {
    let userID: any = localStorage.getItem('userID');
    if (!userID) {
     console.log("NO USER ID");
    }
    return this.http.post<GameEntry>(`${Constants.apiPaths.game}-next`, {
      time: time,
      numOfErrors: numOfErrors,
      'task_type': task_type,
      'user-ID': userID,
      'user-index': imageIndex,
      'dist-offset': distOffset,
      'xCoord': xCoord,
      'yCoord': yCoord,
      'present': present,
      'num_shapes': extra.num_shapes,
      'conjunction': extra.conjunction,
      'target_color': extra.target_color,
      'target_shape': extra.target_shape,
      'x_offset': xOffset,
      'y_offset': yOffset,
      'initial_x': targetPostX,
      'initial_y': targetPosY
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

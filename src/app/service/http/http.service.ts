import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { timeout, retry, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient,
              private commonService: CommonService) {
  }
  async put(serviceName: string, data: any) {
    const headers = new HttpHeaders({
    });
    const options = { headers: headers, withCredintials: false };
    const url = environment.baseAPI + serviceName;
    return this.http.put(url, data, options).pipe(timeout(99999),retry(0),catchError((error: HttpErrorResponse)=>this.handleError(error)));
  }

  async get(serviceName: string) {
    const headers: any = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };
    const options = { headers, withCredintials: false };
    const url = environment.baseAPI + serviceName;
    return this.http.get(url,options).pipe(retry(0),catchError((error: HttpErrorResponse)=>this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    let errMsg = 'Something bad happened; please try again later.';
    if(error.name === 'HttpErrorResponse')
    {
      this.commonService.Alert('Network error','Can\'t connect to server','danger');
    }
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else if (error.status === 401) {
        errMsg = error.error.msg;
    }else if (error.status === 500) {
        errMsg = error.error.msg;
    } else {
      if(error.error.enterpryzeError)
      {
        errMsg = error.error.enterpryzeError.message;
      }
      else
      {
        console.error(
          `Backend returned code ${error.status}, body was: `, error.error);
      }
    }

    return throwError({status:error.status,msg:errMsg});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { Account } from '../interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private _http: HttpClient) { }


  checkPhoneNumberExist(phonenumber: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'text/plain;charset=utf8'
    )
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    }
    return this._http.get<any>("/accounts/" + phonenumber, requestOptions).pipe(
      map(res => JSON.parse(res) as Array<Account>),
      retry(3),
      catchError(this.handleError)
    );
  }
  handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

  postAccount(aAccount: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text'
    };
    // Sử dụng URL tuyệt đối để gọi đến API server (ví dụ: http://localhost:3002)
    return this._http.post<any>('http://localhost:3002/accounts', JSON.stringify(aAccount), requestOptions).pipe(
      map(res => JSON.parse(res) as Account),
      retry(3),
      catchError(this.handleError)
    );
  }

  private apiUrl = 'http://localhost:3002';
  changePassword(phoneNumber: string, oldPassword: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/change-password`;
    const body = { phoneNumber, oldPassword, newPassword };
    return this._http.put<any>(url, body);
  }

  checkPasswordResetSuccess(phonenumber: string) {
    // Gửi yêu cầu đến API để kiểm tra trạng thái đặt lại mật khẩu
    return this._http.get<any>(`/api/check-password-reset/${phonenumber}`);
  }

}
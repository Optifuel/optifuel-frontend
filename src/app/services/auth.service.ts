import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  ip = environment.apiKey;

  checkAuthorization(email: any, token: any): Observable<string> {
    const url = `http://${this.ip}/api/User/checkAuthorization?email=${email}&token=${token}`
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    }).pipe(map(res => res.code));
  }

  login(userdata: any) {
    sessionStorage.setItem('email', userdata.data.email);
    sessionStorage.setItem('token', userdata.data.token);
    sessionStorage.setItem('user', JSON.stringify(userdata.data));
  }

  logout() {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }
}

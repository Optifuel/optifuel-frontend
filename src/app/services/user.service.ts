import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class userService {
  ip = environment.apiKey;
  apiurl = `http://${this.ip}/api/User/`;
  constructor(private http: HttpClient) {}

  AddUser(data: any) {
    const url = `http://${this.ip}/api/User/AddUser`;
    return this.http.post<any>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  ProceedLogin(user: any){
    const url = `http://${this.ip}/api/User/GetUserByEmailAndPassword?email=${user.email}&Password=${user.password}`;
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  EditUser(user: any) {
    const url = `http://${this.ip}/api/User/EditUser`;
    return this.http.post<any>(url, user, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
  
  CheckAuthoritation(email: any, token: any) {
    const url = `http://${this.ip}/api/User/checkAuthorization?email=${email}&token=${token}`
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
  
  verifyEmail(email: any, code: any) {
    const encodedEmail = encodeURIComponent(email);
    console.log(encodedEmail);
    const url = `http://${this.ip}/api/User/VerificationUser?email=${encodedEmail}&token=${code}`
    return this.http.put<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  changePasswordRequest(data:any){
    const url = `http://${this.ip}/api/User/ChangePasswordRequest`;
    return this.http.post<any>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  confirmChangePassword(email: any, token:any){
    const encodedEmail = encodeURIComponent(email);
    const url = `http://${this.ip}/api/User/ChangePassword?email=${encodedEmail}&token=${token}`;
    return this.http.post<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

}




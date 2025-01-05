import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  ip = environment.apiKey;
  apiurl = `http://${this.ip}/api/User/`;

  constructor(private http: HttpClient) { }

  AddVehicle(data: any) {
    const url = `http://${this.ip}/api/Vehicle/AddVehicle`;
    return this.http.post<any>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  GetListVehicleByUser(id: any) {
    const encodedEmail = encodeURIComponent(id);
    const url = `http://${this.ip}/api/User/GetListVehicleByUser?email=${encodedEmail}`;
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  EditVehicle(data: any) {
    const url = `http://${this.ip}/api/Vehicle/EditVehicle`;
    return this.http.put<any>(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  deleteVehicle(email: any, token: any, licensePlate: any) {
    const encodedEmail = encodeURIComponent(email);
    const url = `http://${this.ip}/api/Vehicle/DeleteVehicle?email=${encodedEmail}&token=${token}&licensePlate=${licensePlate}`;
    return this.http.delete<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

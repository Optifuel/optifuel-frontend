import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  constructor(private http: HttpClient) { }
  ip = environment.apiKey;
  apiurl = `http://${this.ip}/api/User/`;

  GetCoordinates(city: any) {
    const url = `http://${this.ip}/api/MapBox/GetCoordinates?city=${city}`;
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  FindGasStation(licensePlate: any, percentTank: any, initLongitude: any, initLatitude: any, endLongitude: any, endLatitude: any) {
    const url = `http://${this.ip}/api/MapBox/FindGasStation?licensePlate=${licensePlate}&percentTank=${percentTank}&initLongitude=${initLongitude}&initLatitude=${initLatitude}&endLongitude=${endLongitude}&endLatitude=${endLatitude}`;
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}


"http://127.0.0.1:5294/api/MapBox/FindGasStation?licensePlate=FB558GL&percentTank=90&initLongitude=41.125784&initLatitude=16.862029&endLongitude=45.067755&endLatitude=7.682489"
"http://localhost:5294/api/MapBox/FindGasStation?licensePlate=FB558GL&percentTank=90&initLongitude=16.862029&initLatitude=41.125784&endLongitude=7.682489&endLatitude=45.067755"
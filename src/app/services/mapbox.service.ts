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

  FindGasStation(licensePlate: any, percentTank: any, coordinates: object) {
    // const url = `http://${this.ip}/api/MapBox/FindGasStation?licensePlate=${licensePlate}&percentTank=${percentTank}&initLongitude=${initLongitude}&initLatitude=${initLatitude}&endLongitude=${endLongitude}&endLatitude=${endLatitude}`;
    const url = `http://${this.ip}/api/MapBox/FindGasStation?licensePlate=${licensePlate}&percentTank=${percentTank}`;
    return this.http.post<any>(url, {
      body: JSON.stringify(coordinates),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
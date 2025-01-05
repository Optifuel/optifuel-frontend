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
    const url = `http://${this.ip}/api/MapBox/FindGasStation?licensePlate=${licensePlate}&percentTank=${percentTank}`;
    return this.http.post<any>(url, coordinates, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  GetPath(coordinates: Array<any>) {
    const mapboxUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving/';
    const coordinatesUrl = coordinates.map((c: any) => `${c.longitude},${c.latitude}`).join(';');
    const url = `${mapboxUrl}${coordinatesUrl}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${environment.mapbox_token}`;
    return this.http.get<any>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
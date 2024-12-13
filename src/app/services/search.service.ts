import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = environment.mapbox_search;
  private accessToken = environment.mapbox_token;

  constructor(private http: HttpClient) {}

  /**
   * Fetch places by category.
   * @param category The category to search for (e.g., 'restaurant').
   * @param language The preferred language for the results (default: 'en').
   * @param limit The maximum number of results to fetch (default: 10).
   * @returns Observable of the response.
   */
  searchSuggestions(
    query: string,
    sessionToken: string,
    language: string = 'it',
    limit: number = 10,
    types: string = 'country,region,district,postcode,locality,place,neighborhood,address,poi,street,category'
  ): Observable<any> {
    const url = `${this.baseUrl}`; // URL dell'endpoint `suggest`
    const params = new HttpParams()
      .set('q', query) // La query di ricerca
      .set('access_token', this.accessToken) // Token di accesso
      .set('session_token', sessionToken) // Token di sessione
      .set('language', language) // Lingua preferita
      .set('limit', limit.toString()) // Numero massimo di risultati
      .set('types', types); // Tipi di risultati da includere

    return this.http.get(url, { params });
  }

  getPOIDetails(
    mapboxId: string,
    sessionToken: string,
  ):Observable<any> {
    const url = `${environment.mapbox_poi_info}${mapboxId}`;
    const params = new HttpParams()
      .set('access_token', this.accessToken)
      .set('session_token', sessionToken);

    return this.http.get(url, { params });
  }
    
}
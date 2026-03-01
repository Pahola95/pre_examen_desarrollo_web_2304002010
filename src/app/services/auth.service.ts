import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiKey = '5996dc308f372b34d704bafb12a3a169';
  private baseUrl = 'https://api.themoviedb.org/3';
  private bearer =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTk2ZGMzMDhmMzcyYjM0ZDcwNGJhZmIxMmEzYTE2OSIsIm5iZiI6MTc3MjMxNTY0MC4yMzIsInN1YiI6IjY5YTM2M2Y4NzQyMDRiMzk2YjQxODI5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lmTsm_Dmxsf-BMhUQuMTbN2JRJA-QL8FFXOU4YkliwQ';

  private accessToken = '';
  constructor(private http: HttpClient) { }

  getAuthentication(): Observable<any> {
    const url = `${this.baseUrl}/authentication/token/new`;
    const params = new HttpParams().set('api_key', this.apiKey);
    const headers = new HttpHeaders().set('accept', 'application/json');
    return this.http.get<any>(url, { headers, params });
  }
  getAccessToken(): string {
    this.loadTokenFromStorage();
    return this.accessToken;
  }

  /**
   * Set access token
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
    this.saveTokenToStorage();
  }
  refreshAccessToken(): Observable<any> {
    const url = `${this.baseUrl}/authentication/token/new`;
    const params = new HttpParams().set('api_key', this.apiKey);
    const headers = new HttpHeaders().set('accept', 'application/json');

    return this.http.get<any>(url, { headers, params }).pipe(
      tap((response: any) => {
        if (response.access_token) {
          this.setAccessToken(response.access_token);
        }
      })
    );
  }
  private saveTokenToStorage(): void {
    localStorage.setItem('tmdb_access_token', this.accessToken);
  }

  /**
   * Load token from localStorage
   */
  private loadTokenFromStorage(): void {
    const storedToken = localStorage.getItem('tmdb_access_token');
    if (storedToken) {
      this.accessToken = storedToken;
    }
  }


  clearToken(): void {
    this.accessToken = '';
    localStorage.removeItem('tmdb_access_token');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface Token {
  request_token: any;
  expires_at: string;
  success: boolean
}
@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private baseUrl = 'https://api.themoviedb.org/3';

  private bearer =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1OTk2ZGMzMDhmMzcyYjM0ZDcwNGJhZmIxMmEzYTE2OSIsIm5iZiI6MTc3MjMxNTY0MC4yMzIsInN1YiI6IjY5YTM2M2Y4NzQyMDRiMzk2YjQxODI5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lmTsm_Dmxsf-BMhUQuMTbN2JRJA-QL8FFXOU4YkliwQ';

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }

  getMovies(page: number = 1): Observable<any> {
    let tokenResp: Token = {
      request_token: '',
      expires_at: '',
      success: false
    };
    this.authService.getAuthentication().subscribe(
      {
        next: (resp) => {
          tokenResp = resp
          this.authService.setAccessToken(resp.request_token)
        }
      }
    );
    const url = `${this.baseUrl}/discover/movie`;
    const headers = new HttpHeaders()
      .set('Authorization',`Bearer ${this.bearer}`)
      .set('accept', 'application/json');
    const params = new HttpParams().set('page', String(page));
    return this.http.get<any>(url, { headers, params });
  }
  rateMovie(movieId: number, rating: number): Observable<any> {
    let tokenResp: Token = {
      request_token: '',
      expires_at: '',
      success: false
    };
    this.authService.getAuthentication().subscribe(
      {
        next: (resp) => {
          tokenResp = resp
          this.authService.setAccessToken(resp.request_token)
          console.log(resp)
        },
        error: (error)=>{
          console.log(error)
        }
      }
    );
    const headers = new HttpHeaders()
      .set('Authorization',`Bearer ${this.bearer}`)
      .set('accept', 'application/json');
    return this.http.post(
      `${this.baseUrl}/movie/${movieId}/rating`,
      { value: rating },
      {
        headers
      }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  constructor(private http: HttpClient) {}

  getRates(base: string = 'USD'): Observable<any> {
    const url = `https://open.er-api.com/v6/latest/${base}`;
    return this.http.get<any>(url);
  }
}

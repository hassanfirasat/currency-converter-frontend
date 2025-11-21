import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ConversionPayload,
  ConversionResult,
  CurrencyOption,
} from '../models/currency.models';

interface CurrencyResponse {
  currencies: CurrencyOption[];
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  getCurrencies(): Observable<CurrencyOption[]> {
    return this.http
      .get<CurrencyResponse>(`${this.baseUrl}/currency/currencies`)
      .pipe(map((response) => response.currencies ?? []));
  }

  convertCurrency(payload: ConversionPayload): Observable<ConversionResult> {
    return this.http.post<ConversionResult>(
      `${this.baseUrl}/currency/convert`,
      payload,
    );
  }
}

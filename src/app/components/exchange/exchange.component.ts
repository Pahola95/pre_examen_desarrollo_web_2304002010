import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExchangeService } from '../../services/exchange.service';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css'],
})
export class ExchangeComponent implements OnInit, OnDestroy {
  rates: { [key: string]: number } = {};
  base = 'USD';
  dateObj: Date | null = null;

  timezone: string = 'America/Guatemala';


  currentTime: Date = new Date();
  private timerId: any;
  loading = true;
  error = '';

  
  bases: string[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'MXN', 'GTQ', 'CNY'];

  
  currencyNames: { [code: string]: string } = {
    USD: 'US Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    CAD: 'Canadian Dollar',
    AUD: 'Australian Dollar',
    MXN: 'Mexican Peso',
    GTQ: 'Guatemalan Quetzal',
    CNY: 'Chinese Yuan',
    CHF: 'Swiss Franc',
    SEK: 'Swedish Krona',
    NZD: 'New Zealand Dollar',
  };


  constructor(private exchangeService: ExchangeService) {}

  ngOnInit(): void {
    this.fetchRates(this.base);
    this.timerId = setInterval(() => (this.currentTime = new Date()), 1000);
  }

  fetchRates(base?: string): void {
    this.loading = true;
    this.error = '';
    const b = base ?? this.base ?? 'USD';
    this.exchangeService.getRates(b).subscribe({
      next: (res) => {
        this.base = res?.base_code ?? b;
        if (res?.time_last_update_unix) {
          this.dateObj = new Date(res.time_last_update_unix * 1000);
        } else if (res?.time_last_update_utc) {
          this.dateObj = new Date(res.time_last_update_utc);
        } else {
          this.dateObj = null;
        }
        this.rates = res?.rates ?? {};
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las tasas de cambio.';
        this.loading = false;
      },
    });
  }

  refresh(): void {
    this.fetchRates(this.base);
  }

  onBaseChange(eventOrBase: Event | string): void {
    let newBase: string | undefined;
    if (typeof eventOrBase === 'string') {
      newBase = eventOrBase;
    } else {
      const target = eventOrBase.target as HTMLSelectElement | null;
      newBase = target?.value ?? undefined;
    }
    if (!newBase) return;
    this.base = newBase;
    this.fetchRates(newBase);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  rateKeys(limit = 300): string[] {
    const keys = Object.keys(this.rates).sort();

    if (this.base && !keys.includes(this.base)) {
      keys.unshift(this.base);
    }
    return keys.slice(0, limit);
  }

  currencyName(code: string): string {
    return this.currencyNames[code] ?? code;
  }

  inverseRate(code: string): number | null {
    if (code === this.base) return 1;
    const r = this.rates[code];
    if (r === undefined || r === 0) return null;
    return 1 / r;
  }

  valueFor100USD(code: string): number {
    if (code === this.base) return 100;
    const r = this.rates[code] ?? 0;
    return r * 100;
  }
}

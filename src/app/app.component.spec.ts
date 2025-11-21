import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { CurrencyService } from './services/currency.service';

const mockCurrencyService = {
  getCurrencies: () =>
    of([
      { code: 'USD', name: 'US Dollar' },
      { code: 'EUR', name: 'Euro' },
    ]),
  convertCurrency: () =>
    of({
      baseCurrency: 'USD',
      targetCurrency: 'EUR',
      amount: 1,
      convertedAmount: 0.9,
      rate: 0.9,
      date: '2024-01-01',
    }),
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideNoopAnimations(),
        {
          provide: CurrencyService,
          useValue: mockCurrencyService,
        },
      ],
    }).compileComponents();
  });

  it('should create the app shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the toolbar headline', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain(
      'Currency Converter',
    );
  });
});

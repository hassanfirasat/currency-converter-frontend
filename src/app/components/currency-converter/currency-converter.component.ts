import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardSurfaceDirective } from '../../directives/card-surface.directive';
import {
  ConversionResult,
  CurrencyOption,
} from '../../models/currency.models';
import { CurrencyService } from '../../services/currency.service';
import { ConversionHistoryService } from '../../services/conversion-history.service';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    CardSurfaceDirective,
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyConverterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly currencyService = inject(CurrencyService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly historyService = inject(ConversionHistoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly today = new Date();
  protected readonly earliestDate = new Date('1999-01-01');

  protected currencies: CurrencyOption[] = [];
  protected isCurrenciesLoading = false;
  protected isConverting = false;
  protected conversionResult?: ConversionResult;
  protected errorMessage?: string;
  protected errorDetails?: string;

  protected readonly converterForm = this.fb.group({
    amount: this.fb.nonNullable.control(100, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    baseCurrency: this.fb.nonNullable.control('USD', Validators.required),
    targetCurrency: this.fb.nonNullable.control('EUR', Validators.required),
    date: this.fb.control<Date | null>(new Date(), Validators.required),
  });

  constructor() {
    this.loadCurrencies();
  }

  protected get isBusy(): boolean {
    return this.isConverting || this.isCurrenciesLoading;
  }

  protected swapCurrencies(): void {
    const base = this.converterForm.controls.baseCurrency.value;
    const target = this.converterForm.controls.targetCurrency.value;
    this.converterForm.patchValue({
      baseCurrency: target,
      targetCurrency: base,
    });
  }

  protected onSubmit(): void {
    if (this.converterForm.invalid) {
      this.converterForm.markAllAsTouched();
      return;
    }

    const { amount, baseCurrency, targetCurrency, date } =
      this.converterForm.getRawValue();
    if (!date) {
      return;
    }

    this.errorMessage = undefined;
    this.errorDetails = undefined;
    const payload = {
      amount: Number(amount),
      baseCurrency,
      targetCurrency,
      date: this.formatDate(date),
    };

    this.isConverting = true;
    this.currencyService
      .convertCurrency(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isConverting = false;
          this.markForCheck();
        }),
      )
      .subscribe({
        next: (result) => {
          this.conversionResult = result;
          this.historyService.add(result);
          this.errorMessage = undefined;
          this.errorDetails = undefined;
          this.markForCheck();
        },
        error: (error) => {
          this.isConverting = false;
          const parsed = this.parseError(error);
          this.errorMessage = parsed.message;
          this.errorDetails = parsed.details;
          this.snackBar.open(parsed.message, 'Dismiss', { duration: 5000 });
          this.markForCheck();
        },
      });
  }

  protected trackCurrency(_index: number, item: CurrencyOption): string {
    return item.code;
  }

  private loadCurrencies(): void {
    this.isCurrenciesLoading = true;
    this.currencyService
      .getCurrencies()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isCurrenciesLoading = false;
          this.markForCheck();
        }),
      )
      .subscribe({
        next: (currencies) => {
          this.currencies = currencies;
          this.ensureSelectedCurrenciesExist();
          this.markForCheck();
        },
        error: () => {
          this.isCurrenciesLoading = false;
          this.snackBar.open(
            'Unable to load the currency list. Please refresh.',
            'Dismiss',
            { duration: 5000 },
          );
          this.markForCheck();
        },
      });
  }

  private ensureSelectedCurrenciesExist(): void {
    if (!this.currencies.length) {
      return;
    }

    const baseExists = this.currencies.some(
      (currency) => currency.code === this.converterForm.value.baseCurrency,
    );
    const targetExists = this.currencies.some(
      (currency) => currency.code === this.converterForm.value.targetCurrency,
    );

    if (!baseExists) {
      this.converterForm.patchValue({
        baseCurrency: this.currencies[0].code,
      });
    }

    if (!targetExists) {
      const fallback = this.currencies.find(
        (currency) => currency.code !== this.converterForm.value.baseCurrency,
      );
      if (fallback) {
        this.converterForm.patchValue({
          targetCurrency: fallback.code,
        });
      }
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseError(error: unknown): { message: string; details?: string } {
    if (error instanceof HttpErrorResponse) {
      const payload = error.error as {
        message?: string;
        details?: Record<string, unknown>;
        info?: string;
      };
      const message =
        payload?.message ??
        error.message ??
        'Unable to convert right now. Please try again.';

      let details: string | undefined;
      if (payload?.details && typeof payload.details === 'object') {
        details = Object.entries(payload.details)
          .map(([field, value]) => {
            if (Array.isArray(value)) {
              return `${field}: ${value.join(', ')}`;
            }
            return `${field}: ${String(value)}`;
          })
          .join(' • ');
      }

      if (payload?.info) {
        const infoText = `More info: ${payload.info}`;
        details = details ? `${details} • ${infoText}` : infoText;
      }

      return { message, details };
    }

    return {
      message: 'Unable to convert right now. Please try again.',
    };
  }

  private markForCheck(): void {
    this.cdr.markForCheck();
  }
}

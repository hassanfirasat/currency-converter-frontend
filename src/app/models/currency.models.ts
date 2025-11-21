export interface CurrencyOption {
  code: string;
  name: string;
  symbol?: string;
  symbolNative?: string;
}

export interface ConversionPayload {
  baseCurrency: string;
  targetCurrency: string;
  amount: number;
  date: string;
}

export interface ConversionResult {
  baseCurrency: string;
  targetCurrency: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  date: string;
}

export interface ConversionRecord extends ConversionResult {
  id: string;
  performedAt: string;
}


import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConversionRecord } from '../models/currency.models';
import { StorageService } from './storage.service';

const HISTORY_STORAGE_KEY = 'currency-converter-history';
const MAX_HISTORY = 50;

@Injectable({
  providedIn: 'root',
})
export class ConversionHistoryService {
  private readonly storage = inject(StorageService);
  private readonly historySubject = new BehaviorSubject<ConversionRecord[]>(
    this.loadHistory(),
  );

  readonly history$ = this.historySubject.asObservable();

  add(record: Omit<ConversionRecord, 'id' | 'performedAt'>): void {
    const newRecord: ConversionRecord = {
      ...record,
      id: crypto.randomUUID?.() ?? `${Date.now()}`,
      performedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...this.historySubject.value].slice(
      0,
      MAX_HISTORY,
    );
    this.historySubject.next(updated);
    this.persist(updated);
  }

  clear(): void {
    this.historySubject.next([]);
    this.storage.removeItem(HISTORY_STORAGE_KEY);
  }

  private loadHistory(): ConversionRecord[] {
    const stored = this.storage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored) as ConversionRecord[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persist(history: ConversionRecord[]): void {
    this.storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }
}

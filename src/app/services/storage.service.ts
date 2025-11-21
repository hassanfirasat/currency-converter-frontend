import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly storage?: Storage | null;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.storage = this.document?.defaultView?.localStorage ?? null;
  }

  getItem(key: string): string | null {
    try {
      return this.storage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage?.setItem(key, value);
    } catch {
      // no-op
    }
  }

  removeItem(key: string): void {
    try {
      this.storage?.removeItem(key);
    } catch {
      // no-op
    }
  }
}

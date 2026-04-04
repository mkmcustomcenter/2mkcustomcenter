import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  isHeaderVisible = signal<boolean>(false);

  showHeader(): void {
    this.isHeaderVisible.set(true);
  }

  hideHeader(): void {
    this.isHeaderVisible.set(false);
  }
}

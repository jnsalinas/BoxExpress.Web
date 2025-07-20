import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavBadgeService {
  private pendingTransfersCountSubject = new BehaviorSubject<number>(0);
  pendingTransfersCount$ = this.pendingTransfersCountSubject.asObservable();

  constructor() {
    // Emitir valor inicial
    this.pendingTransfersCountSubject.next(0);
  }

  updatePendingTransfersCount(count: number) {
    console.log('NavBadgeService - actualizando count a:', count);
    this.pendingTransfersCountSubject.next(count);
  }

  getPendingTransfersCount(): Observable<number> {
    return this.pendingTransfersCount$;
  }
} 
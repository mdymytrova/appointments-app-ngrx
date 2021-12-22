import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private messageSubject = new BehaviorSubject<string | null>(null);
  messages$: Observable<string | null> = this.messageSubject.asObservable();
  
  constructor() { }

  showMessage(message: string) {
    this.messageSubject.next(message);
  }
}

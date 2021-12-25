import { Injectable } from '@angular/core';
import { FirestoreService } from '../core/services/firestore.service';
import { User } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFirestore extends FirestoreService<User> {
  protected path = 'users';
}

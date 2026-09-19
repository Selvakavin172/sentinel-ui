import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoggedInUser {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  riskRating: string;
  kycStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject =
    new BehaviorSubject<LoggedInUser | null>(null);

  user$: Observable<LoggedInUser | null> =
    this.userSubject.asObservable();

  constructor() {}

  setUser(user: LoggedInUser): void {
    this.userSubject.next(user);
  }

  getUser(): LoggedInUser | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  logout(): void {
    this.userSubject.next(null);
  }
}
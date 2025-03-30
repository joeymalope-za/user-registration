import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private loginAttempts = { success: 0, failed: 0 };
  constructor() {}

  get authStatus$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getLoginAttempts() {
    return { ...this.loginAttempts };
  }

  //get isAuthenticated
  getIsAuthenticated(): boolean {
    return this.isAuthenticated.value;
  }

  login() {
    this.isAuthenticated.next(true);
    this.loginAttempts.success++;
  }

  logout() {
    this.isAuthenticated.next(false);
  }

  recordFailedAttempt() {
    this.loginAttempts.failed++;
  }
}

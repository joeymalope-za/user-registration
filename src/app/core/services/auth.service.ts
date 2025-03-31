import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface LoginAttempts {
  success: number;
  failed: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_status';
  private readonly ATTEMPTS_KEY = 'login_attempts';
  private isBrowser: boolean;
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      // Initialize auth state from session
      const savedAuth = window.sessionStorage.getItem(this.AUTH_KEY);
      if (savedAuth) {
        this.isAuthenticated.next(JSON.parse(savedAuth));
      }

      // Initialize login attempts from session
      const savedAttempts = window.sessionStorage.getItem(this.ATTEMPTS_KEY);
      if (!savedAttempts) {
        window.sessionStorage.setItem(
          this.ATTEMPTS_KEY,
          JSON.stringify({ success: 0, failed: 0 })
        );
      }
    }
  }

  get authStatus$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  getLoginAttempts(): LoginAttempts {
    if (!this.isBrowser) {
      return { success: 0, failed: 0 };
    }
    const attempts = window.sessionStorage.getItem(this.ATTEMPTS_KEY);
    return attempts ? JSON.parse(attempts) : { success: 0, failed: 0 };
  }

  getIsAuthenticated(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const savedAuth = window.sessionStorage.getItem(this.AUTH_KEY);
    return savedAuth ? JSON.parse(savedAuth) : false;
  }

  login(): void {
    if (this.isBrowser) {
      this.isAuthenticated.next(true);
      window.sessionStorage.setItem(this.AUTH_KEY, JSON.stringify(true));

      const attempts = this.getLoginAttempts();
      attempts.success++;
      window.sessionStorage.setItem(
        this.ATTEMPTS_KEY,
        JSON.stringify(attempts)
      );
    }
  }

  logout(): void {
    if (this.isBrowser) {
      this.isAuthenticated.next(false);
      window.sessionStorage.setItem(this.AUTH_KEY, JSON.stringify(false));
    }
  }

  recordFailedAttempt(): void {
    if (this.isBrowser) {
      const attempts = this.getLoginAttempts();
      attempts.failed++;
      window.sessionStorage.setItem(
        this.ATTEMPTS_KEY,
        JSON.stringify(attempts)
      );
    }
  }
}

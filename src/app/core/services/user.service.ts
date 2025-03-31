import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

interface User extends UserRegistration {
  joined: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USERS_KEY = 'registered_users';
  private readonly CURRENT_USER_KEY = 'current_user';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser && !window.sessionStorage.getItem(this.USERS_KEY)) {
      window.sessionStorage.setItem(
        this.USERS_KEY,
        JSON.stringify([
          {
            email: 'test@example.com',
            name: 'Test User',
            password: 'password123',
          },
          {
            email: 'user@example.com',
            name: 'Demo User',
            password: 'password123',
          },
        ])
      );
    }
  }

  private getUsers(): User[] {
    if (!this.isBrowser) return [];
    const users = window.sessionStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    if (this.isBrowser) {
      window.sessionStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  // Check if email is already registered
  checkEmailAvailability(email: string): Observable<boolean> {
    if (!this.isBrowser) return of(true);
    return new Observable((observer) => {
      setTimeout(() => {
        const users = this.getUsers();
        const isAvailable = !users.some(
          (user) => user.email.toLowerCase() === email.toLowerCase()
        );
        observer.next(isAvailable);
        observer.complete();
      }, 1000);
    });
  }

  // email validator check if the email is already token
  emailValidator() {}

  // Register new user
  register(userData: UserRegistration): Observable<any> {
    if (!this.isBrowser) {
      return throwError(
        () => new Error('Registration is only available in browser')
      );
    }
    return new Observable((observer) => {
      setTimeout(() => {
        const users = this.getUsers();
        if (
          users.some(
            (user) => user.email.toLowerCase() === userData.email.toLowerCase()
          )
        ) {
          observer.error({ message: 'Email is already registered' });
          return;
        }

        const newUser: User = {
          ...userData,
          joined: new Date(),
        };

        users.push(newUser);
        this.saveUsers(users);
        window.sessionStorage.setItem(
          this.CURRENT_USER_KEY,
          JSON.stringify(newUser)
        );

        observer.next({ success: true });
        observer.complete();
      }, 1500);
    });
  }

  // Get user profile (mock)
  getUserProfile(): Observable<User | null> {
    if (!this.isBrowser) return of(null);
    return new Observable((observer) => {
      setTimeout(() => {
        const currentUser = window.sessionStorage.getItem(
          this.CURRENT_USER_KEY
        );
        observer.next(currentUser ? JSON.parse(currentUser) : null);
        observer.complete();
      }, 800);
    });
  }

  logout(): void {
    if (this.isBrowser) {
      window.sessionStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }

  getCurrentUser(): User | null {
    if (!this.isBrowser) return null;
    const currentUser = window.sessionStorage.getItem(this.CURRENT_USER_KEY);
    return currentUser ? JSON.parse(currentUser) : null;
  }
}

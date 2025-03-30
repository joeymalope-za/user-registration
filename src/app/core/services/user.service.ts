import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // List of emails that are "already taken" for demonstration
  private takenEmails: string[] = ['test@example.com', 'user@example.com'];

  constructor() {}

  // Check if email is already registered
  checkEmailAvailability(email: string): Observable<boolean> {
    // Simulate API call delay
    const isAvailable = !this.takenEmails.includes(email.toLowerCase());
    return of(isAvailable).pipe(delay(1000)); // 1 second delay to simulate network request
  }

  // email validator check if the email is already token
  emailValidator() {}

  // Register new user
  register(userData: UserRegistration): Observable<any> {
    // Simulate API call delay
    return new Observable((observer) => {
      // Simulate server processing
      setTimeout(() => {
        // Check if email is taken
        if (this.takenEmails.includes(userData.email.toLowerCase())) {
          observer.error({ message: 'Email is already registered' });
        } else {
          // Simulate successful registration
          console.log('User registered:', userData);
          observer.next({ success: true });
          observer.complete();
        }
      }, 1500); // 1.5 second delay
    });
  }

  // Get user profile (mock)
  getUserProfile(): Observable<any> {
    // In a real app, this would retrieve user data from an API
    return of({
      name: 'Test User',
      email: 'test@example.com',
      joined: new Date(),
    }).pipe(delay(800));
  }
}

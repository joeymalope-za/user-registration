import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Check if we're on a protected route
  const isProtectedRoute = state.url.includes('profile');

  // If we have a valid session, sync it and allow access
  if (
    isPlatformBrowser(platformId) &&
    window?.sessionStorage?.getItem('auth_status') === 'true'
  ) {
    authService.login(); // Sync BehaviorSubject with session
    return true;
  }

  // If we're on a protected route without auth, redirect to register
  if (isProtectedRoute) {
    return router.createUrlTree(['/register']);
  }

  // Allow access to non-protected routes
  return true;
};

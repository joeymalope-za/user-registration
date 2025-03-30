import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('authenticated', authService.getIsAuthenticated());

  if (authService.getIsAuthenticated()) {
    console.log('Authenticated');
    return true;
  }

  // Redirect to the login page
  return router.parseUrl('/register');
};

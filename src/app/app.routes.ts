import { Routes } from '@angular/router';
import { RegistrationComponent } from './features/registration/registration.component';
import { ProfileComponent } from './features/profile/profile.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'register',
    component: RegistrationComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'register',
  },
];

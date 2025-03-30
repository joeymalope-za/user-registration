/** @format */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './features/registration/registration.component';
import { ProfileComponent } from './features/profile/profile.component';
import { DashboardComponent } from './features/profile/profile.component';
import { UserService } from './core/services/user.service';
import { AuthService } from './core/services/auth.service';
import { AuthGuard } from './core/guards/auth.guard';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppComponent,
    RegistrationComponent,
    DashboardComponent,
    RouterModule.forRoot([
      { path: 'register', component: RegistrationComponent },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      { path: '', redirectTo: '/register', pathMatch: 'full' },
    ]),
  ],
  providers: [UserService, AuthService],
})
export class AppModule {}

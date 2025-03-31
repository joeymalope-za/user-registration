import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  private fb = inject(FormBuilder); // Modern Angular injection
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailAvailabilityValidator()],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  submissionState = {
    loading: false,
    error: '',
  };

  constructor() {}

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  private emailAvailabilityValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return this.userService.checkEmailAvailability(control.value).pipe(
        map((isAvailable) => (isAvailable ? null : { emailTaken: true })),
        catchError(() => of(null))
      );
    };
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.submissionState.loading) {
      this.submissionState = { loading: true, error: '' };

      const formData = {
        name: this.registerForm.value.name!.trim(),
        email: this.registerForm.value.email!.toLowerCase().trim(),
        password: this.registerForm.value.password!,
      };

      this.userService.register(formData).subscribe({
        next: () => {
          this.authService.login();
          this.router.navigate(['/profile']);
          this.submissionState.loading = false;
        },
        error: (error) => {
          this.submissionState = {
            loading: false,
            error: error.message || 'Registration failed. Please try again.',
          };
          this.authService.recordFailedAttempt();
        },
      });
    }
  }

  // Helper method for template access
  getFormControl(controlName: string): AbstractControl | null {
    return this.registerForm.get(controlName);
  }
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../services/auth.service';

export const roleGuard = (requiredRole: UserRole): CanActivateFn => {
  return (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLogged) {
      router.navigate(['/login']);
      return false;
    }

    if (auth.hasRole(requiredRole)) {
      return true;
    }

    router.navigate(['/forbidden']); // o '/home' si prefieres
    return false;
  };
};
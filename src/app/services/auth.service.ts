import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export type UserRole = 0 | 1 | 2;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  get isLogged(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('isLogged') === 'true';
    }
    return false;
  }

  get userRole(): UserRole {
    if (isPlatformBrowser(this.platformId)) {
      return Number(localStorage.getItem('userRole')) as UserRole;
    }
    return 0; // mínimo privilegio en SSR
  }

  hasRole(requiredRole: UserRole): boolean {
    return this.userRole >= requiredRole; 
  }

  login(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('isLogged', 'true');
    }
    this.router.navigate(['/home']);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLogged');
      localStorage.removeItem('userRole');
    }
    this.router.navigate(['/login']);
  }
}
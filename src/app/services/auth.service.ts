import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  get isLogged(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('isLogged') === 'true';
    }
    return false; // En SSR siempre no autenticado
  }

  login(): void {
    if (isPlatformBrowser(this.platformId)) {       // ✅ guard SSR
      localStorage.setItem('isLogged', 'true');
    }
    this.router.navigate(['/home']);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {       // ✅ guard SSR
      localStorage.removeItem('isLogged');
    }
    this.router.navigate(['/login']);
  }
}
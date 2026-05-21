import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Solo accedemos si estamos en el navegador
  if (isPlatformBrowser(platformId)) {
    const isLogged = localStorage.getItem('isLogged') === 'true';
    if (isLogged) return true;
  }

  router.navigate(['/login']);
  return false;
};
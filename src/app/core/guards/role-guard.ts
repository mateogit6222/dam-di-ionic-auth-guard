import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

/**
 * Factoría de Functional Guard para validar roles requeridos.
 * Si el usuario no tiene el rol, redirige a su panel correspondiente o a login.
 */
export const roleGuard = (allowedRole: UserRole): CanActivateFn => {
  return (route, state): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    const currentRole = authService.userRole();

    if (currentRole === allowedRole) {
      return true;
    }

    // Redirección de contención si el rol no coincide
    if (currentRole === 'user') {
      return router.createUrlTree(['/user-dashboard']);
    }

    return router.createUrlTree(['/admin']);
  };
};
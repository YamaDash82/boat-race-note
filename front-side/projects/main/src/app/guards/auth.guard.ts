import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.checkAuthenticated()) {
    return true;
  }
  console.log('ログイン失敗');
  return router.navigate(['/login']);
};

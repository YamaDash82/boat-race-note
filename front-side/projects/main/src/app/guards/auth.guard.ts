import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.checkAuthenticated()) {
    return true;
  }
  //未ログイン時は、新規予想入力画面に遷移する。ただし、登録はできない。  
  return router.navigate(['/prediction/new-prediction/contents/exhibition']);
};

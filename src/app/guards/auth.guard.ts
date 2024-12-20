import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const email = sessionStorage.getItem('email');
  const token = sessionStorage.getItem('token');

  if (!email || !token) {
    router.navigate(['/home/login']);
    return false;
  }

  const res = await authService.checkAuthorization(email, token).toPromise();

  if (res == "0") {
    return true;
  } else {
    router.navigate(['/home/login']);
    return false;
  }

};

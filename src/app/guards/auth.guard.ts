import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from '../services/cookie/cookie.service';
import { AUTH_KEY } from '../interceptors/auth.interceptor';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const cookieService = inject(CookieService);

    const isLoggedIn = !!cookieService.get(AUTH_KEY);
    if (isLoggedIn) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

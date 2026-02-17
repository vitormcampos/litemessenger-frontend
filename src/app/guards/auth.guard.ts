import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from '../services/cookie/cookie.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const cookieService = inject(CookieService);

    if (isLoggedIn(cookieService)) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

const isLoggedIn = (cookieService: CookieService) => {
    return !!cookieService.get('token');
};

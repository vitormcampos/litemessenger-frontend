import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from '../services/cookie/cookie.service';
import { AUTH_KEY } from '../interceptors/auth.interceptor';
import { AuthService } from '../services/auth/auth.service';
import { UserStore } from '../stores/user/user.store';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const cookieService = inject(CookieService);
    const authService = inject(AuthService);
    const userStore = inject(UserStore);

    const isLoggedIn = !!cookieService.get(AUTH_KEY);
    if (isLoggedIn) {
        authService.getCurrentUser().subscribe({
            next: (user) => {
                userStore.setCurrentUser(user);
            },
            error: () => {
                //cookieService.remove(AUTH_KEY);
                router.navigate(['/login']);
            },
        });

        return true;
    }

    router.navigate(['/login']);
    return false;
};

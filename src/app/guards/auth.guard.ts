import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    if (isLoggedIn()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

const isLoggedIn = () => {
    return !!localStorage.getItem('token');
};

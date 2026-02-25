import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from '../services/cookie/cookie.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

export const AUTH_KEY = 'LiteMessengerToken' as const;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const cookieService = inject(CookieService);
    const token = cookieService.get(AUTH_KEY);

    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        return next(authReq).pipe(
            catchError((err) => {
                if (err.status === 401) {
                    //cookieService.remove('token');
                    router.navigate(['/login']);
                }
                throw err;
            })
        );
    }

    return next(req);
};
